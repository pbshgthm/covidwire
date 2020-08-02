import React, { useState, useEffect, useRef} from 'react';
import debounce from "lodash.debounce";

import classNames from 'classnames'
import FeedbackForm from '../components/FeedbackForm.js'



import {feedFormat,formatPageUrl,orderFeed,addStats,getData} from './FeedUtils.js'






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

	useEffect(() => {
    	return () => {
        	_isMounted.current = false;
    	}
  	},[]);

	useEffect(()=>{
		console.log(props.feedConfig)
		setFeedConfig(props.feedConfig)
		setFeedData([])
		setLastPage(0)
		setFetchNow(true)
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
		getData(feedConfig,props.pageVal,lastPage).then(result => {

			setFeedData([
				...feedData,
				...result
			])
			setFetchReady(true)
			setLastPage(lastPage+1)


			if(feedConfig.type==='search')setEndFeed(true)

			if(Object.keys(result).length===0){
				if(feedConfig.type==='feed'){
					setFetchNow(true)
				}else{
					setEndFeed(true)
				}
			}


		});

	}


	return(
		<React.Fragment>
			<FeedbackForm cardData={feedbackData} showFeedback={showFeedback} setShowFeedback={setShowFeedback}/>
			<div className="NewsFeed">
				<div>{feedConfig.type+' '+feedConfig.term}</div>
				{feedFormat(feedData,props.langSel,setFeedbackData)}
			</div>
			{(!endFeed)&&<div className="SkeletonHolder">
				<img className="NewsCardSkeleton" src={require('../assets/card-skeleton.png')} alt="Card Skeleton"/>
				<div className="SkeletonOverlay"></div>
			</div>}
		</React.Fragment>
	)

}

export default SearchFeed;
