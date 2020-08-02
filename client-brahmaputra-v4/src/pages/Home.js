import React, { useState, useEffect} from 'react';
import TitleBar from '../components/TitleBar.js'
import RegionSetting from '../components/RegionSetting.js'
import LangSetting from '../components/LangSetting.js'
import Feed from '../components/Feed.js'
import SearchFeed from '../components/SearchFeed.js'
import Navbar from '../components/Navbar.js'



function Home(props){

	let defaultState=(localStorage.getItem("cwv3-state1")==null)?'Delhi':localStorage.getItem("cwv3-state1");

	let defaultLang=(localStorage.getItem("cwv3-lang1")==null)?'English':localStorage.getItem("cwv3-lang1");

	const [stateSel,setStateSel]=useState(defaultState);
	const [langSel,setLangSel]=useState(defaultLang)

	const [navHide,setNavHide]=useState(false)

	const [feedConfig,setFeedConfig]=useState({
		term:'feed/'+stateSel,
		type: 'feed',
		region: stateSel,
		stats:false
	})

	useEffect(()=>{
		localStorage.setItem("cwv3-lang1", langSel);
	},[langSel])

	useEffect(()=>{
		localStorage.setItem("cwv3-state1", stateSel);
		if(feedConfig.type==='feed'){
			setFeedConfig({
				term:'feed/'+stateSel,
				type:'feed',
				region:stateSel,
				stats:false
			})
		}
		else{
			setFeedConfig({
				term:feedConfig.term,
				type:'search',
				region:stateSel,
				stats:false
			})
		}
	},[stateSel])

	return (
		<div className="FeedPage">
			<TitleBar setNavHide={setNavHide} search={true} title="CovidWire" setFeedConfig={setFeedConfig} feedConfig={feedConfig}/>
			<LangSetting defaultLang={langSel} changeLang={setLangSel}/>
			<RegionSetting defaultState={stateSel} changeState={setStateSel}/>
			{
				//<Feed baseUrl={"feed/"+stateSel} langSel={langSel} pageSize={1} statsRegion={stateSel}/>
			}
			<SearchFeed langSel={langSel} pageSize={1} feedConfig={feedConfig}/>

			{!navHide&&<Navbar/>}
		</div>
	);
}

export default Home;
