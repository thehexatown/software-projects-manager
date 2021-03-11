import { exec } from 'child_process';
import fs from 'fs';

// create project script

export const createProject = async (path, name, event) => {
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
};

//open single Project

export const openProject = async (path, event) => {
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
};

//scan projects

export const scanProjects = async (path, target, counter = 0, event) => {
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
};

//revealed in Folder

export const revealedInFolder = async (path) => {
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
};

//delete node_modules
export const deleteNodeModules = (path) => {
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
};
