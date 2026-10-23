const { contextBridge, ipcRenderer: ipc } = require('electron');
contextBridge.exposeInMainWorld('api', {
  info: () => ipc.invoke('account:get'),
  loginMs: () => ipc.invoke('auth:ms'),
  loginOffline: n => ipc.invoke('auth:offline', n),
  logout: () => ipc.invoke('account:logout'),
  play: ram => ipc.invoke('play', ram),
  onProgress: cb => ipc.on('progress', (_, d) => cb(d)),
  onLog: cb => ipc.on('log', (_, d) => cb(d)),
});
