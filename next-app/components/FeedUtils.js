import React from 'react';
import NewsCard from './NewsCard.js';

import {formatDate} from './utils.js';
import StatsCard from './StatsCard.js';

const SEARCH_ENDPOINT = '/api/search';
const FEED_ENDPOINT = '/api/feed';

const fetchSearch = async (feedConfig, page) => {
	const response = await fetch(SEARCH_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			term: feedConfig.term,
			region: feedConfig.region,
			page
		})
	});

	if (!response.ok) {
		return {'result': [], 'status': false, 'next': false};
	}

	return response.json();
};

const fetchFeedPage = async (feedConfig, pageSize, page) => {
	const response = await fetch(FEED_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			term: feedConfig.term,
			type: feedConfig.type,
			pageSize,
			page
		})
	});

	if (!response.ok) {
		return {'result': [], 'status': false, 'next': false};
	}

	return response.json();
};


export const orderFeed = (rawFeed)=>{
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


export const feedFormat = (feedData,langSel,setFeedbackData,hope=false,mark=false)=>{
	let feedList=[]
	feedData.forEach(dayFeed=>{
		var dayCards=[];
		for(var i=0;i<dayFeed[1].length;i++){
			var cardData=dayFeed[1][i][1];
			dayCards.push(<NewsCard mark={mark} hope={hope} key={cardData.hash} cardData={cardData} langSel={langSel} setFeedbackData={setFeedbackData}/>)
		}
		if(dayCards.length>0){
			feedList.push(<div className="FeedDateBox" key={dayFeed[0]}>{formatDate(dayFeed[0])}</div>)
		}
		feedList=feedList.concat(dayCards)

	})


	var result = feedList.reduce((unique, o) => {
	    if(!unique.some(obj => obj.key === o.key)) {
	      unique.push(o);
	    }
	    return unique;
	},[]);

	return result.slice(1)
}


export const addStats = (statsRegion,feedCards)=>{
	if(feedCards.length===0)return feedCards;
	let final=[feedCards[0]];
	if(statsRegion){
		final=final.concat([<StatsCard key="stats" region={statsRegion}/>])
	}
	return final.concat(feedCards.slice(1))
}


export const getData = (feedConfig, pageSize = 2, lastPage = 0) => {
	if (feedConfig.type === 'search') {
		return fetchSearch(feedConfig, lastPage).then((payload) => {
			if (!payload.status) {
				return {'result': [], 'status': false, 'next': false};
			}
			return {
				'result': orderFeed(payload.result),
				'status': true,
				'next': payload.next
			};
		});
	}

	return fetchFeedPage(feedConfig, pageSize, lastPage)
		.then((payload) => {
			if (!payload.status) {
				return {'result': [], 'status': false, 'next': false};
			}
			return {'result': payload.result, 'status': true, 'next': payload.next};
		})
		.catch(() => ({'result': [], 'status': false, 'next': false}));
};
