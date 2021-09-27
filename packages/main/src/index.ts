import {app, BrowserWindow, ipcMain, Menu, shell} from 'electron';
import {join} from 'path';
import {URL} from 'url';
import {getEditableHostsFromFile, readHostsFile, saveToFile} from '/@/hosts-file-helper';

const isSingleInstance = app.requestSingleInstanceLock();

const isMac = process.platform === 'darwin';

const isDev = import.meta.env.MODE === 'development';

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

// Install "Vue.js devtools"
if (isDev) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('Failed install extension:', e));
}

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      nativeWindowOpen: true,
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      contextIsolation: import.meta.env.MODE !== 'test',   // Spectron tests can't work with contextIsolation: true
      enableRemoteModule: import.meta.env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
    },
    title: 'Hosts File Edit',
    height: 350,
    width: 550,
    minWidth: 350,
    minHeight: 250,
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    if (isDev) {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl = isDev && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();


  await mainWindow.loadURL(pageUrl);
};


app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady()
  .then(createWindow)
  .catch((e) => console.error('Failed create window:', e));


// Auto-updates
if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}


// Events
ipcMain.handle('app:read-hosts-file', () => {
  return readHostsFile();
});

ipcMain.handle('app:get-hosts-lines', () => {
  return getEditableHostsFromFile();
});

ipcMain.handle('app:save-to-hosts', (event, serializedHosts: string) => {
  return saveToFile(serializedHosts);
});

// Menu
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New host line',
        accelerator: 'CmdOrCtrl+N',
        click: () => {mainWindow?.webContents.send('app-menu-call', 'new-line')},
      },
      {
        label: 'Remove all hosts',
        accelerator: 'CmdOrCtrl+D',
        click: () => {mainWindow?.webContents.send('app-menu-call', 'delete-all')},
      },
      {type: 'separator'},
      {
        label: 'Save into hosts file',
        accelerator: 'CmdOrCtrl+S',
        click: () => {mainWindow?.webContents.send('app-menu-call', 'save')},
      },
      {type: 'separator'},
      isMac ? { role: 'close' } : { role: 'quit' }
    ],
  },
  ...(isDev ? [{
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'toggleDevTools'},
    ],
  }] : []),
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' },
      ]),
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          await shell.openExternal('https://github.com/LouWii/hosts-file-edit-2#readme');
        }
      },
    ],
  }
];

app.on('ready', () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
});