import {useState,useEffect,useRef} from 'react';

import TitleBar from '../components/TitleBar.js'
import Setting from '../components/Setting.js'
import Feed from '../components/Feed.js'

import NavBar from '../components/NavBar.js'
import CovidWireHead from '../components/CovidWireHead.js'

const pageName="Hope"

function Hope(props) {

	const [langSel,setLangSel]=useState('English')
	const _isMounted = useRef(true);

	useEffect(()=>{
		setLangSel((localStorage.getItem("cwv3-lang1")==null)?'English':localStorage.getItem("cwv3-lang1"))
	},[])

	useEffect(()=>{
		localStorage.setItem("cwv3-lang1", langSel);
	},[langSel])

	useEffect(() => {
    	return () => {
        	_isMounted.current = false;
    	}
  	},[]);

	return (
		<>
			<div className="FeedPage">
				<TitleBar title="Hope"/>
				<div className="HopeBg"></div>
				<img className="HopeHeader" src="/assets/hope-title.png" alt="Hope Title"/>
				<div className="HopeDesc">Dearly curated with the hope to bring to light positive news</div>
				<Setting changeLang={setLangSel} defaultLang={langSel}/>
				{_isMounted.current && <Feed baseUrl={"hope"} langSel={langSel} pageSize={5}Z/>}
			</div>
		</>
	);
}

export default Hope;
