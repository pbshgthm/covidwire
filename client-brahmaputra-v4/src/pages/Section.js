import React, {useState,useEffect,useRef} from 'react';
import {urlDecode} from '../components/utils.js'

import TitleBar from '../components/TitleBar.js'
import LangSetting from '../components/LangSetting.js'
import Feed from '../components/Feed.js'
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


	useEffect(() => {
    	return () => {
        	_isMounted.current = false;
    	}
  	}, []);

	return (
		<React.Fragment>
			<div className="FeedPage">
				<TitleBar title={section} showBack={true}/>
				<LangSetting defaultLang={langSel} changeLang={setLangSel}/>
				{ _isMounted.current && <Feed baseUrl={"section/"+regCorr(section)} langSel={langSel} pageSize={3} />}
			</div>
			<Navbar/>
		</React.Fragment>

	);
}

export default Section;
