import React, {useState,useEffect,useRef} from 'react';
import {urlDecode} from '../components/utils.js'


import TitleBar from '../components/TitleBar.js'
import Setting from '../components/Setting.js'
import Feed from '../components/Feed.js'

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
		<div className="FeedPage">
			<TitleBar title={section} showBack={true}/>
			<img onClick={()=>{window.history.back()}} src={require('../assets/back.png')} alt="back" className="SectionBack"/>
			<div className="PageTitle">{section}</div>
			<Setting changeLang={setLangSel} defaultLang={langSel}/>
			{ _isMounted.current && <Feed baseUrl={"section/"+regCorr(section)} langSel={langSel} pageSize={3} />}
		</div>
	);
}

export default Section;
