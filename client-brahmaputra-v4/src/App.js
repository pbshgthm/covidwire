import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import {Switch,Route,Redirect} from "react-router-dom";
import './App.css';

import Home from './pages/Home.js'
import SectionsList from './pages/SectionsList.js'
import Hope from './pages/Hope.js'
import BlogList from './pages/BlogList.js'
import About from './pages/About.js'


function App() {

	return (
		<Router>
			<Switch>
				<Route exact path="/" render={() => {
                    	return (<Redirect to="/home" />)
                }}/>
				<Route path="/home" component={Home}/>
				<Route path="/hope" component={Hope}/>
				<Route path="/sections" component={SectionsList}/>
				<Route path="/blog" component={BlogList}/>
				<Route path="/about" component={About}/>
			</Switch>
			<div className="DesktopBlock">
				Hello!<br/>
				CovidWire now has a brand new mobile version with multiple new features. Desktop version will be updated soon.<br/><br/>
				<a href="https://dev.covidwire.in/" >Click here</a> to continue viewing the previous desktop version.
			</div>
		</Router>

  );
}

export default App;
