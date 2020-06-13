import React, {useState,useEffect,useRef} from 'react';

import TitleBar from '../components/TitleBar.js'
import Setting from '../components/Setting.js'
import Feed from '../components/Feed.js'

function Hope(props) {

	let defaultLang=(localStorage.getItem("cwv3-lang1")==null)?'English':localStorage.getItem("cwv3-lang1");

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
			<TitleBar title="Hope"/>
			<div className="HopeBg"></div>
			<img className="HopeHeader" src={require('../assets/hope-title.png')} alt="Hope Title"/>
			<div className="HopeDesc">Dearly curated with the hope to bring to light positive news</div>
			<Setting changeLang={setLangSel} defaultLang={langSel}/>
			{_isMounted.current && <Feed baseUrl={"hope"} langSel={langSel} pageSize={5}Z/>}
		</div>
	);
}

export default Hope;
