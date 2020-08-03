import React, {useState,useEffect,useRef} from 'react';

import TitleBar from '../components/TitleBar.js'
import LangSetting from '../components/LangSetting.js'
import Navbar from '../components/Navbar.js'
import FeedbackForm from '../components/FeedbackForm.js'
import {scrollToTop} from '../components/utils.js'

import {feedFormat,orderFeed} from '../components/FeedUtils.js'
import {getSaved} from '../components/utils.js'

function Saved(props) {
	let defaultLang=(localStorage.getItem("cwv3-lang1")==null)?'English':localStorage.getItem("cwv3-lang1");

	const [langSel,setLangSel]=useState(defaultLang)
	const _isMounted = useRef(true);

	const [showFeedback,setShowFeedback]=useState(false);
	const [feedbackData,setFeedbackData]=useState("");

	const [feedData,setFeedData]=useState({})
	const [readReady,setReadReady]=useState(false)

	useState(()=>{
		scrollToTop(false)
		let savedList=Object.values(getSaved())
		let dateDict={}
		savedList.forEach((card, i) => {
			let date=card.time.split('T')[0]
			if(date in dateDict){
				dateDict[date][card.hash]=card
			}else{
				dateDict[date]={}
				dateDict[date][card.hash]=card
			}
		});
		setFeedData(orderFeed(dateDict))
		console.log(orderFeed(dateDict))
		setReadReady(true)

	},[])


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
			<TitleBar title="Saved" showBack={true} backPath="/sections"/>
			<div className="FeedPage">
				<LangSetting defaultLang={langSel} changeLang={setLangSel}/>
				<FeedbackForm cardData={feedbackData} showFeedback={showFeedback} setShowFeedback={setShowFeedback}/>
				<div className="NewsFeed">
					{readReady&&feedFormat(feedData,langSel,setFeedbackData)}
				</div>
				<Navbar/>
			</div>
		</React.Fragment>
	);
}

export default Saved;
