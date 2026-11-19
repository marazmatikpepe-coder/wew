const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktop', {
  quit: () => ipcRenderer.send('app:quit'),
  minimize: () => ipcRenderer.send('app:minimize'),
  toggleFullscreen: () => ipcRenderer.send('app:toggle-fullscreen')
});
