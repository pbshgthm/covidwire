import React, { useState, useEffect, useRef} from 'react';
import debounce from "lodash.debounce";

import classNames from 'classnames'
import FeedbackForm from '../components/FeedbackForm.js'

import axios from 'axios';

import {feedFormat,formatPageUrl,orderFeed,addStats} from './FeedUtils.js'


function SearchFeed(props){

	const _isMounted = useRef(true);

	const [keyword,setKeyword]=useState(props.keyword);
	const [feedData,setFeedData]=useState([]);

	const [fetchReady,setFetchReady]=useState(true);
	const [fetchNow,setFetchNow]=useState(false);

	const [lastPage,setLastPage]=useState(0);
	const [endFeed,setEndFeed]=useState(false)

	const [showFeedback,setShowFeedback]=useState(false);
	const [feedbackData,setFeedbackData]=useState("");
	const [autoTrans,setAutoTrans]=useState(true)

	useEffect(() => {
    	return () => {
        	_isMounted.current = false;
    	}
  	},[]);

	useEffect(()=>{
		setFeedData([])
		setLastPage(0)
		setFetchNow(true)
	},[props.keyword])


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
		if(!_isMounted.current)return;
		if (window.innerHeight+document.documentElement.scrollTop+350> 		document.documentElement.offsetHeight
      	){
		  	if(fetchReady){setFetchNow(true)}
      	}
    }, 100);


	const fetchFeed = ()=>{
		if(endFeed)return


		console.log(keyword)
		if(keyword==="")return;
		axios({
			method: 'post',
			url: "https://us-central1-covidwire.cloudfunctions.net/v4_search",
			data: {
				"keywords":keyword,
				"filter":{
					"key":"*",
					"type":"*"
				}
			},
		}).then(result => {
			console.log(result.data)
			if(_isMounted.current){
				setFeedData([
					...feedData,
					...orderFeed(result.data)
				])
				setFetchReady(true)
				setLastPage(lastPage+1)

				if(Object.keys(result).length===0){
					setFetchNow(true)
				}
			}
		});

	}


	return(
		<React.Fragment>
			<FeedbackForm cardData={feedbackData} showFeedback={showFeedback} setShowFeedback={setShowFeedback}/>
			<div className="NewsFeed">{
				feedFormat(feedData,props.langSel,setFeedbackData,autoTrans)
			}</div>
			{(!endFeed)&&<div className="SkeletonHolder">
				<img className="NewsCardSkeleton" src={require('../assets/card-skeleton.png')} alt="Card Skeleton"/>
				<div className="SkeletonOverlay"></div>
			</div>}
		</React.Fragment>
	)

}

export default SearchFeed;
