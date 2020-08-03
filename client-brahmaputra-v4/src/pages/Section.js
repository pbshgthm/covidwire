import React, {useState,useEffect,useRef} from 'react';
import {urlDecode} from '../components/utils.js'

import TitleBar from '../components/TitleBar.js'
import LangSetting from '../components/LangSetting.js'
import SearchFeed from '../components/SearchFeed.js'
import Navbar from '../components/Navbar.js'
function regCorr(x){
	let commonDict={
		"World":"Global",
		"India":"National"
	}
	return (x in commonDict)?commonDict[x]:x
}

function Section(props) {
	let defaultLang=(localStorage.getItem("cwv3-lang1")==null)?'English':localStorage.getItem("cwv3-lang1");

	let section = urlDecode(props.match.params.section);
	const [langSel,setLangSel]=useState(defaultLang)
	const _isMounted = useRef(true);

	useEffect(()=>{
		localStorage.setItem("cwv3-lang1", langSel);
	},[langSel])

	const [feedConfig,setFeedConfig]=useState({
		term:'section/'+section,
		type: 'section',
		region: section,
		stats:false
	})

	useEffect(() => {
    	return () => {
        	_isMounted.current = false;
    	}
  	}, []);

	return (
		<React.Fragment>
			<div className="FeedPage">
				<TitleBar title={section} showBack={true} backPath={'/sections'}/>
				<LangSetting defaultLang={langSel} changeLang={setLangSel}/>
				{ _isMounted.current && <SearchFeed langSel={langSel} pageSize={5} feedConfig={feedConfig}/>}
			</div>
			<Navbar/>
		</React.Fragment>

	);
}

export default Section;
