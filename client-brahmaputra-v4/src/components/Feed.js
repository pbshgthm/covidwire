import React, { useState, useEffect, useRef} from 'react';
import debounce from "lodash.debounce";
import {formatPageUrl,orderFeed,feedFormat,scrollToTop} from '../components/utils.js';

import FeedbackForm from '../components/FeedbackForm.js'


function Feed(props){

	const _isMounted = useRef(true);
	const isInitialMount = useRef(true);
	const [baseUrl,setBaseUrl]=useState(props.baseUrl);
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
  	}, []);


	useEffect(()=>{
		setBaseUrl(props.baseUrl)
		setFeedData([])
		setLastPage(0)
		setFetchNow(true)
	},[props.baseUrl])

	useEffect(()=>{

		if(!_isMounted.current)return;
		if(fetchNow){
			fetchFeed()
			setFetchNow(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[fetchNow])

	useEffect(()=>{
		if (isInitialMount.current) {
     		isInitialMount.current = false;
			scrollToTop()
  		}
	})

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
		if(!_isMounted.current)return;
		if (window.innerHeight+document.documentElement.scrollTop+350> 		document.documentElement.offsetHeight
      	){
		  	if(fetchReady){setFetchNow(true)}
      	}
    }, 100);

	const fetchFeed = ()=>{
		if(endFeed)return
		let url="https://covidwire.firebaseio.com/v3/"+baseUrl
		setFetchReady(false)

		let pageVal=formatPageUrl(lastPage,props.pageSize)
		if(!pageVal){
			setEndFeed(true)
			return;
		}
		console.log(url+'.json'+pageVal)
		fetch(url+'.json'+pageVal)
			.then(
				(result)=>result.json()
			.then(
				(result)=>{
					if(_isMounted.current){
						setFeedData([
							...feedData,
							...orderFeed(result)
						])
						setFetchReady(true)
						setLastPage(lastPage+1)

						if(Object.keys(result).length===0){
							setFetchNow(true)
						}
					}
				}
		))
	}
	//this is a checkpoint
	return(
		<React.Fragment>
			<FeedbackForm headline={feedbackData} showFeedback={showFeedback} setShowFeedback={setShowFeedback}/>
			<div className="NewsFeed">{feedFormat(feedData,props.langSel,setFeedbackData)}</div>
			{(!endFeed)&&<div className="SkeletonHolder">
				<img className="NewsCardSkeleton" src={require('../assets/card-skeleton.png')} alt="Card Skeleton"/>
				<div className="SkeletonOverlay"></div>
			</div>}
		</React.Fragment>
	)

}

export default Feed;
