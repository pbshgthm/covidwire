import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './App';

import About from './pages/About.js';
import Team from './pages/Team.js';


ReactDOM.render(
  <React.StrictMode>
	  <BrowserRouter>
            <Switch>
               <Route path="/" component={App} exact/>
               <Route path="/about" component={About}/>
			   <Route path="/team" component={Team}/>
             </Switch>
        </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorker.unregister();
