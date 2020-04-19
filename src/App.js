import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";

import Home from "./components/Home/Home";
import Add from "./components/Add/Add";
import Edit from "./components/Edit/Edit";

function App() {
    return (
        <div className="app">
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/add" component={Add} />
                    <Route path="/edit/:id" component={Edit} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
