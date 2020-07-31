import React, { useState, useEffect, useRef} from 'react';
import debounce from "lodash.debounce";
import {formatDate,scrollToTop} from '../components/utils.js';
import classNames from 'classnames'
import FeedbackForm from '../components/FeedbackForm.js'
import NewsCard from './NewsCard.js'
import StatsCard from './StatsCard.js'


function formatPageUrl(pageNum,pageSize=1){
	//bug occurs when the page reload happens before and after 0530 IST
	//Duplicate key-s found in feed
	let start=new Date(new Date().setDate(new Date().getDate()-
	(pageSize*pageNum+pageSize))).toISOString().split('T')[0];

	let end=new Date(new Date().setDate(new Date().getDate()-
	(pageSize*pageNum+1))).toISOString().split('T')[0];
	if(pageNum===0){end=new Date(new Date().setDate(new Date().getDate()-
	0)).toISOString().split('T')[0];}
	if(start<'2020-03-01')return false;
	return '?orderBy="$key"&startAt="'+start+'"&endAt="'+end+'"';
}


function orderFeed(rawFeed){
	let orderedFeed=[]

	function regOrder(reg){
		var regionOrder={
			'Global':2,
			'National':1,
		}
		if(reg in regionOrder)return regionOrder[reg];
		return 0;
	}

	for(const date in rawFeed){
		let day_news=Object.entries(rawFeed[date])
		day_news.sort(function(a,b){
			return regOrder(a[1].region)-regOrder(b[1].region)
		})
		orderedFeed.push([date,day_news])
	}
	orderedFeed.sort(function(a,b){
		if(a[0]>b[0])return -1;
		if(a[0]<b[0])return 1;
		return 0;
	})
	return(orderedFeed)
}



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
	const [autoTrans,setAutoTrans]=useState(true)

	useEffect(() => {
    	return () => {
        	_isMounted.current = false;
    	}
  	},[]);

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
	},[fetchNow])


	useEffect(()=>{
		if (isInitialMount.current) {
     		isInitialMount.current = false;
			scrollToTop()
  		}
	},[])


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
		let url="https://covidwire.firebaseio.com/"+baseUrl
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

	function feedFormat(feedData,langSel,setFeedbackData,autoTrans){
		let feedList=[]
		feedData.forEach(dayFeed=>{
			var dayCards=[];
			for(var i=0;i<dayFeed[1].length;i++){
				var cardData=dayFeed[1][i][1]
				//if(!autoTrans){
					//if(cardData.digests[langSel]['auto'])continue;
				//}
				dayCards.push(<NewsCard key={cardData.hash} cardData={cardData} langSel={langSel} setFeedbackData={setFeedbackData}/>)
			}
			if(dayCards.length>0){
				feedList.push(<div className="FeedDateBox" key={dayFeed[0]}>{formatDate(dayFeed[0])}</div>)
			}
			feedList=feedList.concat(dayCards)

		})
		//if(feedList.length<2){
			//console.log('asa',feedList)
			//setFetchNow(true);
			//return []
		//}
		return feedList.slice(1)
	}


	function addStats(statsRegion,feedCards){
		if(feedCards.length===0)return feedCards;
		let final=[feedCards[0]];
		if(statsRegion){
			final=final.concat([<StatsCard key="stats" region={statsRegion}/>])
		}
		return final.concat(feedCards.slice(1))
	}

	return(
		<React.Fragment>
			<FeedbackForm cardData={feedbackData} showFeedback={showFeedback} setShowFeedback={setShowFeedback}/>
			{/*<div onClick={()=>setAutoTrans(!autoTrans)} className={classNames("AutoTransSwitch",{
				"AutoTransSwitchSel":autoTrans
			})}>Show Auto translation</div>*/}
			<div className="NewsFeed">{
				addStats(props.statsRegion,feedFormat(feedData,props.langSel,setFeedbackData,autoTrans))
			}</div>
			{(!endFeed)&&<div className="SkeletonHolder">
				<img className="NewsCardSkeleton" src={require('../assets/card-skeleton.png')} alt="Card Skeleton"/>
				<div className="SkeletonOverlay"></div>
			</div>}
		</React.Fragment>
	)

}

export default Feed;
