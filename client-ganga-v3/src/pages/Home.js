import React, { useState, useEffect,useRef} from 'react';
import TitleBar from '../components/TitleBar.js';
import Setting from '../components/Setting.js';
import Feed from '../components/Feed.js';
import classNames from 'classnames';


function FundUsBanner(props){
	const _isMounted = useRef(true);
	const [bannerSel,setBannerSel]=useState(false);
	const [bannerClose,setBannerClose]=useState(false);

	useEffect(() => {
    	return () => {
        	_isMounted.current = false;
    	}
  	}, []);

	window.addEventListener('scroll', ()=>{
		if(!_isMounted.current)return;
		if (document.documentElement.scrollTop>300 ){
		   setBannerSel(true)
	   }
	   else{
		   setBannerSel(false)
	   }
	});

	return(
		<a href="https://milaap.org/fundraisers/support-sarigama-yerra-1" target="_blank" rel="noopener noreferrer">
			<div className={classNames("FundUsBanner",{
				"FundUsBannerShow":(bannerSel&&(!bannerClose))
				})}>Click here to support our fundraising
				<img className="BannerClose" src={require('../assets/close.png')} alt="back" onClick={(event)=>{
					event.preventDefault();
					setBannerClose(true)
					return false;
				}}/>
			</div>
		</a>
	)
}


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
			<FundUsBanner/>
			<img className="MainLogo" alt="CW Logo" src={require('../assets/logo-main.png')}/>
			<Setting defaultState={stateSel} changeState={setStateSel} changeLang={setLangSel} defaultLang={langSel}/>
			<Feed baseUrl={"feed/"+stateSel} langSel={langSel} pageSize={1}/>
		</div>
	);
}

export default Home;
