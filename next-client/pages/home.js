import { useState, useEffect} from 'react';
import TitleBar from '../components/TitleBar.js'
import Setting from '../components/Setting.js'
import Feed from '../components/Feed.js'
import NavBar from '../components/NavBar.js'
import CovidWireHead from '../components/CovidWireHead.js'



const pageName="Home"

function Home(props){

	const [stateSel,setStateSel]=useState('Delhi');
	const [langSel,setLangSel]=useState('English')

	useEffect(()=>{
		setStateSel((localStorage.getItem("cwv3-state1")==null)?'Delhi':localStorage.getItem("cwv3-state1"))

		setLangSel((localStorage.getItem("cwv3-lang1")==null)?'English':localStorage.getItem("cwv3-lang1"))
	},[])

	useEffect(()=>{
		localStorage.setItem("cwv3-state1", stateSel);
		localStorage.setItem("cwv3-lang1", langSel);
	},[stateSel,langSel])

	return (
		<>
			<div className="FeedPage">
				<TitleBar title="CovidWire"/>
				<img className="MainLogo" alt="CW Logo" src='/assets/logo-main.png'/>
				<Setting defaultState={stateSel} changeState={setStateSel} changeLang={setLangSel} defaultLang={langSel}/>
				<Feed baseUrl={"feed/"+stateSel} langSel={langSel} pageSize={1}/>
			</div>
		</>
	);
}

export default Home;
