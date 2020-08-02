import React, {useState,useEffect,useRef} from 'react';

import TitleBar from '../components/TitleBar.js'
import LangSetting from '../components/LangSetting.js'
import SearchFeed from '../components/SearchFeed.js'
import Navbar from '../components/Navbar.js'

function Hope(props) {
	let defaultLang=(localStorage.getItem("cwv3-lang1")==null)?'English':localStorage.getItem("cwv3-lang1");

	const [langSel,setLangSel]=useState(defaultLang)
	const _isMounted = useRef(true);

	const [feedConfig,setFeedConfig]=useState({
		term:'hope',
		type: 'feed',
		region: 'Hope',
		stats:false
	})

	const [navHide,setNavHide]=useState(false)

	useEffect(()=>{
		localStorage.setItem("cwv3-lang1", langSel);
	},[langSel])

	useEffect(() => {
    	return () => {
        	_isMounted.current = false;
    	}
  	}, []);

	return (
		<div className="FeedPage">
			<img className="HopeTitle" src={require("../assets/hope-title.png")}/>
			<div className="HopeBg"></div>
			<LangSetting defaultLang={langSel} changeLang={setLangSel} hope={true}/>
			<div className="HopeDesc">Dearly curated with the hope to bring positive new to light</div>
			{_isMounted.current && <SearchFeed langSel={langSel} pageSize={5} feedConfig={feedConfig}/>}
			<Navbar/>
		</div>
	);
}

export default Hope;
