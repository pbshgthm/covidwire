import React, {useState,useEffect,useRef} from 'react';

import TitleBar from '../components/TitleBar.js'
import LangSetting from '../components/LangSetting.js'
import Feed from '../components/Feed.js'
import Navbar from '../components/Navbar.js'

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
			<LangSetting defaultLang={langSel} changeLang={setLangSel}/>
			{_isMounted.current && <Feed baseUrl={"hope"} langSel={langSel} pageSize={5}Z/>}
			<Navbar/>
		</div>
	);
}

export default Hope;
