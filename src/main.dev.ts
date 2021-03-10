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
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

let { exec } = require('child_process');

console.log(`${process.cwd()}/projects/abc.txt`, 'samuns>>S>Fdfdgdgrgfg');

// create project script
async function createproject(path, name, event) {
  event.reply('acknoledgement', { loading: true });

  exec(
    ` cd ${path} && npx react-native init ${name}`,
    (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr>>>>>>>> ${stderr}`);
        // let temp = [];
        // temp = stderr.split('✔');
        // console.log(temp);
        event.reply('creating-project-progress', stderr);

        return;
      }
      console.log('consoling', stdout);
      if (stdout) {
        console.log('=============Project Created Succesfuly===========');
        event.reply('project-complete', { path, name });
        event.reply('acknoledgement', { loading: false });
        console.log(`stdout>>>>>>>>>>>>>>: ${stdout}`);
      }
    }
  );
}

async function scanProjects(path, target, counter = 0, event) {
  const files = await fs.readdirSync(path, { withFileTypes: true });
  const dirs = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.name === target && !file.isDirectory()) {
      return [path];
    }
    if (file.isDirectory()) {
      dirs.push(file);
    }
  }
  const projects = [];
  for (let i = 0; i < dirs.length; i++) {
    const dir_path = `${path}/${dirs[i].name}`;
    const result = await scanProjects(dir_path, target, counter + 1);
    for (let i = 0; i < result.length; i++) {
      projects.push(result[i]);
    }
  }
  return projects;
}
async function openProject(path, event) {
  fs.readdir(path, (err, files) => {
    files.forEach((file) => {
      if (file === 'package.json') {
        let tempObj = {};
        let projects = [];
        const getFolderName = path.split('/');
        console.log(getFolderName.length - 1);
        tempObj.name = getFolderName[getFolderName.length - 1];
        tempObj.path = path;
        projects.push(tempObj);

        event.reply('project-found', { projects: projects });

        // event.reply('project-found', {path,name});
        // fs.readFile(`${path}/package.json`, 'utf8', function (err, data) {
        //   if (err) {
        //     return console.log(err);
        //   }
        //   const n = data.search('productName');
        //   console.log('found', data[45]);
        // });
        console.log('files', file);
      }
    });
  });
}
async function revealedInFolder(path) {
  console.log(path, 'recived');
  exec(`cd ${path} && open .`, (error: any, stdout: any, stderr: any) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }
  });
}
async function deleteNodeModules(path) {
  console.log(path, 'recived');
  exec(
    `  cd ${path}  && rm -rf node_modules `,
    // `  cd ${path}  && rm -rf node_modules && cd ios && rm -rf Pods `,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}

// // clean node_modules and pod project script

// console.log(
//   'excuting when project is created..........................>>>>>>>>>>>>>>>>>>>'
// );
// exec(
//   ' cd .. && cd auto-project/testApp  && rm -rf node_modules && cd ios && rm -rf Pods ',
//   (error, stdout, stderr) => {
//     if (error) {
//       console.log(`error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.log(`stderr: ${stderr}`);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//   }
// );
// shell.openExternal(`file://${process.cwd()}/projects`);

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let addProject;

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
ipcMain.on('scan-projects', (event, arg) => {
  let scan;
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
ipcMain.on('open-project-path', (event, arg) => {
  dir = dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      buttonLabel: 'choose project path',
    })
    .then(async (res) => {
      if (!res.canceled) {
        createproject(res.filePaths[0], arg, event);
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
ipcMain.on('add-project', () => {
  // addProject = new BrowserWindow({
  //   // parent: mainWindow,
  //   // width: 100,
  //   // height: 100,
  //   resizable: false,
  //   title: 'Add Project',
  // });
  // let name = prompt('Enter project name');
  // addProject.loadURL(`file://${__dirname}/index.html`);
  // addProject.show();
  // addProject.setAlwaysOnTop(true);
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
