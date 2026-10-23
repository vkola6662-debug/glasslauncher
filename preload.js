// Minecraft install + launch core: no third-party deps, uses Mojang's official endpoints.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { spawn } = require('child_process');

const VERSION = '1.21.11';
const OS = { win32: 'windows', darwin: 'osx', linux: 'linux' }[process.platform];
const arm = process.arch === 'arm64';
const JAVA_PLATFORM = OS === 'windows' ? (arm ? 'windows-arm64' : 'windows-x64')
  : OS === 'osx' ? (arm ? 'mac-os-arm64' : 'mac-os') : 'linux';

const mk = p => fs.mkdirSync(p, { recursive: true });
const sha1 = f => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
const json = async u => { const r = await fetch(u); if (!r.ok) throw new Error(`${r.status} ${u}`); return r.json(); };

async function download(url, dest, hash) {
  if (fs.existsSync(dest) && (!hash || sha1(dest) === hash)) return;
  mk(path.dirname(dest));
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url); if (!r.ok) throw new Error(r.status);
      fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer())); return;
    } catch (e) { if (i === 2) throw new Error(`Download failed: ${url}`); }
  }
}
async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); }));
}
// Mojang rule evaluation (features-based rules like demo mode are ignored)
const allowed = rules => !rules || rules.reduce((a, r) => {
  const hit = !r.features && (!r.os || ((!r.os.name || r.os.name === OS) && r.os.arch !== 'x86'));
  return hit ? r.action === 'allow' : a;
}, false);

async function install(root, progress) {
  progress('Fetching version info…', 0);
  const manifest = await json('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json');
  const entry = manifest.versions.find(v => v.id === VERSION);
  if (!entry) throw new Error(`Version ${VERSION} not found`);
  const v = await json(entry.url);
  const vdir = path.join(root, 'versions', VERSION);
  mk(vdir); fs.writeFileSync(path.join(vdir, `${VERSION}.json`), JSON.stringify(v));

  const jobs = [];
  const c = v.downloads.client;
  jobs.push([c.url, path.join(vdir, `${VERSION}.jar`), c.sha1]);
  for (const l of v.libraries) {
    const a = l.downloads && l.downloads.artifact;
    if (a && allowed(l.rules)) jobs.push([a.url, path.join(root, 'libraries', a.path), a.sha1]);
  }
  const idxFile = path.join(root, 'assets', 'indexes', `${v.assetIndex.id}.json`);
  await download(v.assetIndex.url, idxFile, v.assetIndex.sha1);
  const objects = Object.values(JSON.parse(fs.readFileSync(idxFile, 'utf8')).objects);
  for (const o of objects) {
    const p = o.hash.slice(0, 2);
    jobs.push([`https://resources.download.minecraft.net/${p}/${o.hash}`, path.join(root, 'assets', 'objects', p, o.hash), o.hash]);
  }
  // Bundled Java runtime from Mojang, so users don't need to install Java
  const comp = v.javaVersion.component;
  const all = await json('https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json');
  const jm = await json(all[JAVA_PLATFORM][comp][0].manifest.url);
  const jroot = path.join(root, 'runtime', comp);
  const exec = [];
  for (const [rel, f] of Object.entries(jm.files)) {
    if (f.type !== 'file') continue;
    const dest = path.join(jroot, rel);
    jobs.push([f.downloads.raw.url, dest, f.downloads.raw.sha1]);
    if (f.executable) exec.push(dest);
  }
  let done = 0;
  await pool(jobs, 16, async ([u, d, h]) => {
    await download(u, d, h); done++;
    if (done % 25 === 0 || done === jobs.length) progress(`Downloading files… ${done}/${jobs.length}`, done / jobs.length);
  });
  if (OS !== 'windows') exec.forEach(f => fs.chmodSync(f, 0o755));
  return { v, jroot, comp };
}

function javaBin(jroot) {
  if (OS === 'windows') return path.join(jroot, 'bin', 'javaw.exe');
  if (OS === 'osx') return path.join(jroot, 'jre.bundle', 'Contents', 'Home', 'bin', 'java');
  return path.join(jroot, 'bin', 'java');
}

function offlineUUID(name) {
  const h = crypto.createHash('md5').update('OfflinePlayer:' + name).digest();
  h[6] = (h[6] & 0x0f) | 0x30; h[8] = (h[8] & 0x3f) | 0x80;
  return h.toString('hex');
}

async function play(root, acct, ramMB, progress, log) {
  const { v, jroot } = await install(root, progress);
  progress('Starting Minecraft…', 1);
  const libs = v.libraries.filter(l => l.downloads && l.downloads.artifact && allowed(l.rules))
    .map(l => path.join(root, 'libraries', l.downloads.artifact.path));
  libs.push(path.join(root, 'versions', VERSION, `${VERSION}.jar`));
  const natives = path.join(root, 'natives', VERSION); mk(natives);
  const vars = {
    auth_player_name: acct.name, version_name: VERSION, game_directory: root,
    assets_root: path.join(root, 'assets'), assets_index_name: v.assetIndex.id,
    auth_uuid: acct.uuid, auth_access_token: acct.token, clientid: '', auth_xuid: '',
    user_type: acct.type === 'msa' ? 'msa' : 'legacy', version_type: v.type,
    natives_directory: natives, launcher_name: 'GlassCraft', launcher_version: '1.0',
    classpath: libs.join(path.delimiter), classpath_separator: path.delimiter,
    library_directory: path.join(root, 'libraries'),
  };
  const flat = list => list.flatMap(a => typeof a === 'string' ? [a] : allowed(a.rules) ? [].concat(a.value) : []);
  const sub = s => s.replace(/\$\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  const args = [`-Xmx${ramMB}M`, ...flat(v.arguments.jvm).map(sub), v.mainClass, ...flat(v.arguments.game).map(sub)];
  const child = spawn(javaBin(jroot), args, { cwd: root });
  child.stdout.on('data', d => log(d.toString())); child.stderr.on('data', d => log(d.toString()));
  return new Promise((res, rej) => {
    child.on('error', rej);
    child.on('close', code => code === 0 ? res() : rej(new Error(`Game exited with code ${code}`)));
  });
}
module.exports = { VERSION, play, offlineUUID };
