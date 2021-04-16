import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import {Switch,Route,Redirect} from "react-router-dom";
import './App.css';

import Home from './pages/Home.js'
import SectionsList from './pages/SectionsList.js'
import Hope from './pages/Hope.js'
import BlogList from './pages/BlogList.js'
import About from './pages/About.js'
import Saved from './pages/Saved.js'
import Desktop from './pages/Desktop.js'


function App() {

	return (
		<React.Fragment>
			<div className="DesktopPage">
				<div className="DesktopTitle">CovidWire</div>
				<div className="DesktopDesc">A volunteer-driven platform bringing you wide-ranging news snippets on COVID-19 from prominent media of India and the world in multiple languages</div>
				<div className="DesktopNotif">CovidWire is designed for a mobile experience. Please check the webapp on a mobile device. <br/>To try our moblie simulator, <a href="/desktop">click here</a></div>
			</div>
			<Router>
				<Switch>
					<Route exact path="/" render={() => {
	                    	return (<Redirect to="/home" />)
	                }}/>
					<Route path="/home" component={Home}/>
					<Route path="/hope" component={Hope}/>
					<Route path="/sections" component={SectionsList}/>
					<Route path="/saved" component={Saved}/>
					<Route path="/blog" component={BlogList}/>
					<Route path="/about" component={About}/>
					<Route path="/desktop" component={Desktop}/>
				</Switch>
			</Router>
		</React.Fragment>

  );
}

export default App;
