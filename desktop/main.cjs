const { app, BrowserWindow, Menu, net, protocol, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const APP_URL = 'xiangqi://game/';
protocol.registerSchemesAsPrivileged([{
  scheme: 'xiangqi',
  privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true },
}]);

function createWindow() {
  const win = new BrowserWindow({
    title: '中國象棋',
    width: 1280,
    height: 960,
    minWidth: 360,
    minHeight: 480,
    backgroundColor: '#171310',
    icon: path.join(app.getAppPath(), 'desktop/icon.ico'),
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true },
  });

  const openExternal = (url) => {
    if (new URL(url).protocol === 'https:') shell.openExternal(url);
  };
  win.webContents.setWindowOpenHandler(({ url }) => {
    openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== APP_URL && url !== `${APP_URL}index.html`) {
      event.preventDefault();
      openExternal(url);
    }
  });
  win.loadURL(APP_URL);
}

app.whenReady().then(() => {
  const root = app.getAppPath();
  protocol.handle('xiangqi', (request) => {
    const url = new URL(request.url);
    if (url.host !== 'game' || !['GET', 'HEAD'].includes(request.method)) {
      return new Response('Not found', { status: 404 });
    }
    let file;
    try {
      file = path.resolve(root, `.${decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)}`);
    } catch {
      return new Response('Bad request', { status: 400 });
    }
    const relative = path.relative(root, file);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
      return new Response('Not found', { status: 404 });
    }
    return net.fetch(pathToFileURL(file).href);
  });
  Menu.setApplicationMenu(null);
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => app.quit());
