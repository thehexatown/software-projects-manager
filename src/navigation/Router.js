import React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";

import Home from "../screen/home/Home";
import Project from "../screen/projects/Projects";

export default function MianRouter() {
  return (
    <HashRouter>
      <div>
        <main>
          <Route path="/home" component={Home}></Route>
          <Route path="/project" component={Project}></Route>
          <Route exact path="/" component={Home}></Route>
        </main>
      </div>
    </HashRouter>
  );
}
