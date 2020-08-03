import React, {useState,useEffect,useRef} from 'react';

import TitleBar from '../components/TitleBar.js'
import LangSetting from '../components/LangSetting.js'
import SearchFeed from '../components/SearchFeed.js'
import Navbar from '../components/Navbar.js'
import classNames from 'classnames'
import {scrollToTop} from '../components/utils.js'

function Hope(props) {
	scrollToTop(false)
	let defaultLang=(localStorage.getItem("cwv3-lang1")==null)?'English':localStorage.getItem("cwv3-lang1");

	const [langSel,setLangSel]=useState(defaultLang)
	const _isMounted = useRef(true);
	const [showTitle,setShowTitle]=useState(false)

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


	window.addEventListener('scroll', ()=>{
		if(!_isMounted.current)return;
		if (document.documentElement.scrollTop>150 ){
		   setShowTitle(true)
	   }
	   else{
		   setShowTitle(false)
	   }
	});

	return (
		<div className="FeedPage">
			<div className={classNames("HopeTitlebar",{"HopeTitlebarSel":showTitle})}>
				<img className="HopeTitlebarImg" src={require("../assets/hope-title.png")}/>
			</div>
			<img className="HopeHeader" src={require("../assets/hope-title.png")}/>
			<div className="HopeBg"></div>
			<LangSetting defaultLang={langSel} changeLang={setLangSel} hope={true}/>
			<div className="HopeDesc">Dearly curated with the hope to bring positive news to light</div>
			{_isMounted.current && <SearchFeed langSel={langSel} pageSize={5} feedConfig={feedConfig} hope={true}/>}
			<Navbar/>
		</div>
	);
}

export default Hope;
