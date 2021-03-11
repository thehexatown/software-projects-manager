import React, { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import { createHashHistory } from 'history';
import { Link } from 'react-router-dom';

import _ from 'lodash';
import ListingCard from './ListingCard';
import Popup from './AddProject';
import LoadingPopUp from './terminalPopUp';

const electron = window.require('electron');
const { ipcRenderer } = require('electron');

export default function Projects() {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [projectPath, setProjectPath] = useState(null);
  const [IsLoading, setIsloading] = useState(false);
  const [projectsList, setProjectList] = useState(null);
  const [select, setSelect] = useState(false);
  const [selectedprojects, setSelectedProjects] = useState([]);
  const [createProcess, setcreateprocess] = useState('creating new project...');

  useEffect(() => {
    let record = JSON.parse(localStorage.getItem('projects'));
    if (!record) {
      record = {
        electron: [],
        reactNative: [],
        angular: [],
        nodeJs: [],
      };
    }
    setProjectList(record);
    console.log('projects array', record);
    localStorage.setItem('projects', JSON.stringify(record));

    ipcRenderer.on('project-complete', (event, arg) => {
      if (arg.path && arg.name) {
        console.log('Hi', arg.path, arg.name);
        let record = JSON.parse(localStorage.getItem('projects'));
        if (!record) {
          record = {
            electron: [],
            reactNative: [],
            angular: [],
            nodeJs: [],
          };
        }
        const temp = record.electron;
        temp.push(arg);
        record.electron = temp;
        setProjectList(record);
        // console.log('temp', record);
        localStorage.setItem('projects', JSON.stringify(record));
      }
    });
    ipcRenderer.on('acknoledgement', (event, arg) => {
      const { loading } = arg;
      console.log(arg);
      setIsloading(loading);
    });
    ipcRenderer.on('creating-project-progress', (event, arg) => {
      setcreateprocess(arg);
    });
    ipcRenderer.on('scan-projects-result', (event, arg) => {
      const { projects, count } = arg;
      if (count > 0) {
        const previous = JSON.parse(localStorage.getItem('projects'));
        const union = _.unionBy(projects, previous.electron, 'path');
        previous.electron = union;
        setProjectList(previous);
        localStorage.setItem('projects', JSON.stringify(previous));
      }
    });
    ipcRenderer.on('project-found', (event, arg) => {
      const { projects } = arg;
      console.log('found ', projects);
      if (arg) {
        const previous = JSON.parse(localStorage.getItem('projects'));
        const union = _.unionBy(projects, previous.electron, 'path');
        previous.electron = union;
        setProjectList(previous);
        localStorage.setItem('projects', JSON.stringify(previous));
        // let res = JSON.parse(localStorage.getItem('projects'));
        // if (!res) {
        //   res = {
        //     electron: [],
        //     reactNative: [],
        //     angular: [],
        //     nodeJs: [],
        //   };
        // }
        // const temp = res.electron;
        // temp.push(arg);
        // res.electron = temp;
        // setProjectList(res);
        // localStorage.setItem('projects', JSON.stringify(res));
      }
    });
  }, [1]);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const onSave = () => {
    ipcRenderer.send('open-project-path', projectName);
    togglePopup();
  };
  const onExplore = (item) => {
    ipcRenderer.send('revealed-in-folder', item.path);
  };
  const onDeleteNodeModules = (item) => {
    ipcRenderer.send('delete-node-modules', item.path);
  };
  const newproject = () => {
    // ipcRenderer.send('open-project-path');

    setIsOpen(true);
    // setTimeout(async() => {
    //  async ipcRenderer.send('a');
    // }, 3000);
    // ipcRenderer.send('b');
  };
  const openProject = () => {
    ipcRenderer.send('open-project');
  };
  const cleanProjects = () => {
    if (selectedprojects.length > 0)
      ipcRenderer.send('clean-all-selected-modules', selectedprojects);
  };
  const scanProjects = () => {
    ipcRenderer.send('scan-projects');
  };
  const selectProjects = (data, das) => {};

  const onCheck = (data, val) => {
    // const temp = [];
    data.isCheck = val;
    if (val) {
      selectedprojects.push(data);
      setSelectedProjects(selectedprojects);
    }
    if (!val) {
      const uncheck = selectedprojects.filter((item) => item.path != data.path);
      const index = selectedprojects.indexOf(data);
      selectedprojects.splice(index, 1);
      setSelectedProjects(selectedprojects);
    }
  };
  console.log('aha', selectedprojects);
  return (
    <div className="project-container">
      {IsLoading && (
        <LoadingPopUp
          content={
            <div className="terminal-container">
              <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                // timeout={3000} //3 secs
              />
              <div className="process-list">
                <h4>{`${createProcess}`}</h4>
              </div>
            </div>
          }
        />
      )}
      {isOpen && (
        <Popup
          handleClose={togglePopup}
          path={projectPath}
          onChange={(e) => setProjectName(e.target.value)}
          onSave={onSave}
          IsLoading={IsLoading}
          // onChangePath={(e) => setProjectPath(e.target.value)}
          // onPathSelect={handlepath}
        />
      )}
      <div className="content">
        <div className="header">
          <h1>PROJECTS</h1>
          <div className="btn-container">
            {select && (
              <>
                <button onClick={cleanProjects}>
                  <h4>Clean Projects </h4>
                </button>
                <button
                  onClick={selectProjects}
                  onClick={() => {
                    const temp = [];
                    setSelectedProjects(temp);
                    setSelect((prev) => !prev);
                  }}
                >
                  <h4>Cancell selected </h4>
                </button>
              </>
            )}
            <button onClick={() => setSelect((prev) => !prev)}>
              <h4>Select Projects </h4>
            </button>
            <button onClick={scanProjects}>
              <h4>Scan Projects</h4>
            </button>
            <button
              onClick={openProject}
              // onClick={()=>history.push('/home')}
            >
              <h4>Open Project</h4>
            </button>
            <button onClick={newproject}>
              <h4>NEW PROJECT</h4>
            </button>
          </div>
        </div>
        <ListingCard
          projects={projectsList}
          openPath={onExplore}
          onDeleteNodeModules={onDeleteNodeModules}
          showSelect={select}
          cancellAllSelected={selectedprojects.length === 0}
          onCheck={onCheck}
        />
        <div className="footer">
          <h4>A PRODUCT BY</h4>
          <h2>HEXATOWN</h2>
        </div>
      </div>
    </div>
  );
}
