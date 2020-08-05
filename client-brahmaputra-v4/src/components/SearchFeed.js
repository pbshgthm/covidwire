import React, { useState, useEffect, useRef} from 'react';
import debounce from "lodash.debounce";

import FeedbackForm from '../components/FeedbackForm.js'

import {preventScroll,scrollToTop} from './utils.js'
import {feedFormat,getData} from './FeedUtils.js'
import StatsCard from './StatsCard'



function addStats(statsRegion,feedCards){
 		if(feedCards.length===0)return feedCards;
 		let final=[feedCards[0]];
 		if(statsRegion){
 			final=final.concat([<StatsCard key="stats" region={statsRegion}/>])
 		}
		let supportCards=[
			<a href="https://api.whatsapp.com/send?text=*Have%20you%20checked%20out%20CovidWire* %0AA%20volunteer-driven%20platform%20bringing%20you%20wide-ranging%20news%20snippets%20on%20COVID-19%20from%20prominent%20media%20of%20India%20and%20the%20world%20in%20multiple%20languages.%0A%0AThis%20is%20a%20community%20driven%20platform%2C%20so%20you%20can%20be%20a%20part%20of%20it%20too!%0A%0AVisit%20and%20checkout%20this%20project%20at%20*https%3A%2F%2Fcovidwire.in*"><img key="supportCard" className="FeedSupportCards" src={require('../assets/share-card.png')} alt="Share Card"/></a>,

			<a href="https://covidwire.in/s/joincovidwire" target="_blank" rel="noopener noreferrer"><img key="supportCard" className="FeedSupportCards" src={require('../assets/join-card.png')} alt="Share Card"/></a>,

			<a href="https://covidwire.in/s/feedback" target="_blank" rel="noopener noreferrer"><img key="supportCard" className="FeedSupportCards" src={require('../assets/talk-card.png')} alt="Share Card"/></a>
		]

 		final=final.concat(feedCards.slice(1))
		let ind=Math.floor(Math.floor(Math.random() * 6)/2)
		final.splice(4,0,supportCards[ind])
		return final

}


function SearchFeed(props){

	const _isMounted = useRef(true);

	const [feedConfig,setFeedConfig]=useState(props.feedConfig);
	const [feedData,setFeedData]=useState([]);

	const [fetchReady,setFetchReady]=useState(true);
	const [fetchNow,setFetchNow]=useState(false);

	const [lastPage,setLastPage]=useState(0);
	const [endFeed,setEndFeed]=useState(false)

	const [showFeedback,setShowFeedback]=useState(false);
	const [feedbackData,setFeedbackData]=useState("");

	const [noResult,setNoResult]=useState(false)

	useEffect(() => {
    	return () => {
        	_isMounted.current = false;
    	}
  	},[]);

	useEffect(()=>{
		setFeedConfig(props.feedConfig)
		setFeedData([])
		setLastPage(0)
		setFetchNow(true)
		scrollToTop(false)

	},[props.feedConfig])


	useEffect(()=>{
		if(!_isMounted.current)return;
		if(fetchNow){
			fetchFeed()
			setFetchNow(false)
		}
	},[fetchNow])


	useEffect(()=>{
		if(feedbackData!=="")
		setShowFeedback(true)
	},[feedbackData])


	useEffect(()=>{
		if(!showFeedback)
		setFeedbackData("")
	},[showFeedback])


	window.onscroll = debounce(() => {
		if(endFeed)return
		if(feedConfig.type==='search')
		if(!_isMounted.current)return;
		if (window.innerHeight+document.documentElement.scrollTop+350> 		document.documentElement.offsetHeight
      	){
		  	if(fetchReady){setFetchNow(true)}
      	}
    }, 100);


	const fetchFeed = ()=>{
		setEndFeed(false)
		setNoResult(false)
		if(feedConfig.type==="search"){
			preventScroll(true)
		}
		getData(feedConfig,props.pageSize,lastPage).then(response => {
				let result=response['result']
				if(!response['status']){
					setEndFeed(true)
					return
				}
				setFeedData([
					...feedData,
					...result
				])
				setFetchReady(true)
				setLastPage(lastPage+1)

				if(feedConfig.type==='search'){
					preventScroll(false)
					setEndFeed(true)
				}

				if(Object.keys(result).length===0){
					if(feedConfig.type==='feed'||feedConfig.type==='section'){
						setFetchNow(true)
					}else{
						setNoResult(true)
						setEndFeed(true)
					}
				}


		});

	}

	return(
		<React.Fragment>
			<FeedbackForm cardData={feedbackData} showFeedback={showFeedback} setShowFeedback={setShowFeedback}/>
			<div className="NewsFeed">
				{props.feedConfig.stats?addStats(props.feedConfig.region,feedFormat(feedData,props.langSel,setFeedbackData,props.hope,(feedConfig.type==="search"?feedConfig.term:false))):feedFormat(feedData,props.langSel,setFeedbackData,props.hope,(feedConfig.type==="search"?feedConfig.term:false))}
				{noResult&&<img className="NoResult" src={require('../assets/no-result.png')} alt="NoResult"/>}
			</div>
			{(!endFeed)&&<div className="SkeletonHolder">
				<img className="NewsCardSkeleton" src={require('../assets/card-skeleton-'+(feedConfig.type==="search"?"search.png":"fetch.png"))} alt="Card Skeleton"/>
				<div className="SkeletonOverlay"></div>
			</div>}
		</React.Fragment>
	)

}

export default SearchFeed;
