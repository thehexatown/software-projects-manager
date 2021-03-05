// import {ipcRenderer} from "electron"
import React from 'react';
// import {ipcRenderer} from "electron";

import { createHashHistory } from 'history';
import { Link } from 'react-router-dom';
import ListingCard from './ListingCard';
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
// const shell = require("electron").shell;
// const { ipcRenderer } = require("electron");
// const ipcRenderer = window.require('electron').ipcRenderer
export default function Projects() {
  const newproject = () => {
    // console.log("hhjh");
    ipcRenderer.send('open-project-path');
  };
  return (
    <div className="project-container">
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
