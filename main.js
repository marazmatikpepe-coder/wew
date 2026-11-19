const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    frame: false,
    fullscreen: true,
    backgroundColor: '#170d25',
    icon: path.join(__dirname, 'assets', 'app-icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
}

app.whenReady().then(() => {
  ipcMain.on('app:quit', () => app.quit());
  ipcMain.on('app:minimize', () => mainWindow?.minimize());
  ipcMain.on('app:toggle-fullscreen', () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()));
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
