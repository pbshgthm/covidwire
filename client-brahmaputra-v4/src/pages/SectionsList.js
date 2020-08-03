import React from 'react';
import { Switch,Route,Link } from "react-router-dom";

import {urlEncode,scrollToTop} from '../components/utils.js'
import config from '../config.js'
import Section from './Section.js'
import Navbar from '../components/Navbar.js'
import TitleBar from '../components/TitleBar.js'


function SectionsList() {
	return (
  	  <Switch>
  		  <Route exact path="/sections" component={SectionsPage}/>
  		  <Route path="/sections/:section" component={Section}/>
  	  </Switch>
    );
}

function SectionsPage(){

	scrollToTop(false)
	function regCorr(x){
		let commonDict={
			"Global":"World",
			"National":"India"
		}
		return (x in commonDict)?commonDict[x]:x
	}

	return(
		<div>
			<TitleBar title="Sections"/>
			<div className="SectionHolder">
				<div className="SectionImageHolder">
					<Link to={'sections/featured'}>
						<div className="SectionCard">
							<img className="SectionImage" src={require('../assets/sections/featured.png')} alt="Featured"/>
							<div className="SectionName">Featured</div>
						</div>
					</Link>
					<Link to={'/saved'}>
						<div className="SectionCard">
							<img className="SectionImage" src={require('../assets/sections/saved.png')} alt="Saved"/>
							<div className="SectionName">Saved</div>
						</div>
					</Link>
				</div>
				<div className="SectionCategory">Domains</div>
				<div className="SectionImageHolder">
					{config.domain.map(x=>(
						<Link key={"section-"+x} to={"sections/"+urlEncode(x)}>
							<div className="SectionCard">
								<img className="SectionImage" src={require("../assets/sections/"+x+'.jpg')} alt={x}/>
								<div className="SectionName">{x}</div>
							</div>
						</Link>)
					)}
				</div>
				<div className="SectionCategory">Regions</div>
				<div className="SectionImageHolder">
					{config.region.map(x=>(
						<Link key={"section-"+regCorr(x)} to={"sections/"+urlEncode(regCorr(x))}>
							<div className="SectionCard">
								<img className="SectionImage" src={require("../assets/sections/"+regCorr(x)+'.jpg')} alt={regCorr(x)}/>
								<div className="SectionName">{regCorr(x)}</div>
							</div>
						</Link>)
					)}
				</div>
			</div>
			<div className="BottomSpace"></div>
			<Navbar/>
		</div>
	)
}

export default SectionsList;
