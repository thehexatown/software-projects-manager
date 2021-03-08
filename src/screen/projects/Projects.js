import React, { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import { createHashHistory } from 'history';
import { Link } from 'react-router-dom';

import ListingCard from './ListingCard';
import Popup from './AddProject';
import LoadingPopUp from '../../components/PopUp';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
// const shell = require("electron").shell;
// const { ipcRenderer } = require("electron");
// const ipcRenderer = window.require('electron').ipcRenderer
export default function Projects() {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [projectPath, setProjectPath] = useState(null);
  const [IsLoading, setIsloading] = useState(false);

  useEffect(() => {
    ipcRenderer.on('project-complete', (event, arg) => {
      if (arg.path && arg.name) {
        console.log('Hi', arg.path, arg.name);
        let record = JSON.parse(localStorage.getItem('projects'));
        if (!record) record = [];
        record.push(arg);
        localStorage.setItem('projects', JSON.stringify(record));
      }
    });
    ipcRenderer.on('acknoledgement', (event, arg) => {
      const { loading } = arg;
      console.log(arg);
      setIsloading(loading);
    });
  }, [1]);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const onSave = () => {
    ipcRenderer.send('open-project-path', projectName);
    togglePopup();

    // console.log('jikjkjkhjh');
    // ipcRenderer.send('open-project-path');
  };
  const newproject = () => {
    // ipcRenderer.send('open-project-path');

    setIsOpen(true);
    // setTimeout(async() => {
    //  async ipcRenderer.send('a');
    // }, 3000);
    // ipcRenderer.send('b');
  };
  return (
    <div className="project-container">
      {IsLoading && (
        <LoadingPopUp
          content={
            <Loader
              type="Puff"
              color="#00BFFF"
              height={100}
              width={100}
              // timeout={3000} //3 secs
            />
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
            <Link to="home">
              <button
              // onClick={()=>history.push('/home')}
              >
                <h4>SCAN PROJECTS</h4>
              </button>
            </Link>
            <button onClick={newproject}>
              <h4>NEW PROJECT</h4>
            </button>
          </div>
        </div>
        <ListingCard />
        <div className="footer">
          <h4>A PRODUCT BY</h4>
          <h2>HEXATOWN</h2>
        </div>
      </div>
    </div>
  );
}
