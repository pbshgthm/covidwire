import React, { useState, useEffect} from 'react';
import TitleBar from '../components/TitleBar.js'
import RegionSetting from '../components/RegionSetting.js'
import LangSetting from '../components/LangSetting.js'
import Feed from '../components/Feed.js'




function Home(props){

	let defaultState=(localStorage.getItem("cwv3-state1")==null)?'Delhi':localStorage.getItem("cwv3-state1");

	let defaultLang=(localStorage.getItem("cwv3-lang1")==null)?'English':localStorage.getItem("cwv3-lang1");

	const [stateSel,setStateSel]=useState(defaultState);
	const [langSel,setLangSel]=useState(defaultLang)

	useEffect(()=>{
		localStorage.setItem("cwv3-state1", stateSel);
		localStorage.setItem("cwv3-lang1", langSel);
	},[stateSel,langSel])

	return (
		<div className="FeedPage">
			<TitleBar title="CovidWire"/>
			<LangSetting defaultLang={langSel} changeLang={setLangSel}/>
			<RegionSetting defaultState={stateSel} changeState={setStateSel}/>
			<Feed baseUrl={"feed/"+stateSel} langSel={langSel} pageSize={1}/>
		</div>
	);
}

export default Home;
