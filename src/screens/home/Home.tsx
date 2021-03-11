import React from 'react';
import { Link } from 'react-router-dom';
import platformList from '../../constants/platformList';

export default function Home() {
  return (
    <div className="home-container">
      <div className="content">
        <div className="header">
          <h1>SELECT PLATFORM</h1>
        </div>
        <div className="platform-content">
          {platformList.map((item, index) => (
            <Link to="project">
              <div key={`id-${index}`} className="logo-container">
                <div style={{ backgroundImage: `url(${item.icon})` }} />
              </div>
            </Link>
          ))}
        </div>
        <div className="footer">
          <h4>A PRODUCT BY</h4>
          <h2>HEXATOWN</h2>
        </div>
      </div>
    </div>
  );
}
