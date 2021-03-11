/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import MenuBuilder from './menu';
import {
  createProject,
  scanProjects,
  openProject,
  revealedInFolder,
  deleteNodeModules,
} from './electron/features';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    icon: getAssetPath('icon.png'),
    // resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

ipcMain.on('open-error', () => {
  console.log('clikeddd');
  dialog.showErrorBox('erroe', 'sssdd');
});

ipcMain.on('revealed-in-folder', (event, arg) => {
  revealedInFolder(arg);
});

ipcMain.on('delete-node-modules', (event, arg) => {
  deleteNodeModules(arg);
});

ipcMain.on('clean-all-selected-modules', async (event, arg) => {
  for (let i = 0; i < arg.length; i++) {
    console.log('buddy', arg[i].path);
    deleteNodeModules(arg[i].path);
  }
});

let dial;
ipcMain.on('open-project', (event, arg) => {
  dial = dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      buttonLabel: 'choose project path',
    })
    .then(async (res) => {
      if (!res.canceled) {
        openProject(res.filePaths[0], event);
      }
    });
});

let scan;
ipcMain.on('scan-projects', (event, arg) => {
  scan = dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      buttonLabel: 'choose project path',
    })
    .then(async (res) => {
      if (!res.canceled) {
        scanProjects(res.filePaths[0], 'package.json', event)
          .then((res) => {
            let projects = [];
            for (let i = 0; i < res.length; i++) {
              let temp = {};
              let name = res[i].split('/');
              temp.name = name[name.length - 1];
              temp.path = res[i];
              projects.push(temp);
            }
            event.reply('scan-projects-result', {
              projects: projects,
              count: res.length,
            });
          })
          .catch((err) => {
            console.warn(err);
          });
      }
    });
});

let revealedDial;
ipcMain.on('open-project-path', (event, arg) => {
  revealedDial = dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      buttonLabel: 'choose project path',
    })
    .then(async (res) => {
      if (!res.canceled) {
        createProject(res.filePaths[0], arg, event);
      }
    });
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
