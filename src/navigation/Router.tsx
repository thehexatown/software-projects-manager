import React from 'react';
import { Route, HashRouter } from 'react-router-dom';

import Home from '../screens/home/Home';
import Project from '../screens/projects/Projects';

export default function MianRouter() {
  return (
    <HashRouter>
      <Route path="/home" component={Home} />
      <Route path="/project" component={Project} />
      <Route exact path="/" component={Home} />
    </HashRouter>
  );
}
