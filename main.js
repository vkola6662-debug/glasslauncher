const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path'), fs = require('fs');
const { Auth } = require('msmc');
const core = require('./core');

const ROOT = path.join(app.getPath('appData'), '.glasscraft');
const STORE = path.join(ROOT, 'account.json');
const am = new Auth('select_account');
let acct = null, win;

const load = () => { try { acct = JSON.parse(fs.readFileSync(STORE, 'utf8')); } catch { acct = null; } };
const save = () => { fs.mkdirSync(ROOT, { recursive: true }); acct ? fs.writeFileSync(STORE, JSON.stringify(acct)) : fs.rmSync(STORE, { force: true }); };
const pub = () => acct && { type: acct.type, name: acct.name, uuid: acct.uuid };

app.whenReady().then(() => {
  load();
  win = new BrowserWindow({
    width: 1000, height: 650, minWidth: 860, minHeight: 560, backgroundColor: '#15161a',
    titleBarStyle: 'hidden', titleBarOverlay: { color: '#00000000', symbolColor: '#d8d9dc', height: 38 },
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true },
  });
  win.setMenuBarVisibility(false);
  win.loadFile('renderer/index.html');
});
app.on('window-all-closed', () => app.quit());

ipcMain.handle('account:get', () => ({ account: pub(), version: core.VERSION }));
ipcMain.handle('account:logout', () => { acct = null; save(); });
ipcMain.handle('auth:offline', (_, name) => {
  name = String(name || '').trim();
  if (!/^\w{3,16}$/.test(name)) throw new Error('Name must be 3–16 letters, digits or _');
  acct = { type: 'offline', name, uuid: core.offlineUUID(name), token: '0' };
  save(); return pub();
});
ipcMain.handle('auth:ms', async () => {
  const x = await am.launch('electron');
  const mc = await x.getMinecraft();
  acct = { type: 'msa', name: mc.profile.name, uuid: mc.profile.id, token: mc.mcToken, ms: x.save() };
  save(); return pub();
});
ipcMain.handle('play', async (e, ramMB) => {
  if (!acct) throw new Error('Sign in first');
  if (acct.type === 'msa') { // refresh the Microsoft session so the token is always valid
    const x = await am.refresh(acct.ms), mc = await x.getMinecraft();
    acct.token = mc.mcToken; acct.ms = x.save(); save();
  }
  await core.play(ROOT, acct, ramMB,
    (text, pct) => e.sender.send('progress', { text, pct }),
    line => e.sender.send('log', line));
});
