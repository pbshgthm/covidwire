import React from 'react'
import NewsCard from './NewsCard.js'

import {formatDate} from '../components/utils.js';
import StatsCard from './StatsCard.js'
import axios from 'axios';

export const formatPageUrl = (pageNum,pageSize=1)=>{
	let start=new Date(new Date().setDate(new Date().getDate()-
	(pageSize*pageNum+pageSize))).toISOString().split('T')[0];

	let end=new Date(new Date().setDate(new Date().getDate()-
	(pageSize*pageNum+1))).toISOString().split('T')[0];
	if(pageNum===0){end=new Date(new Date().setDate(new Date().getDate()-
	0)).toISOString().split('T')[0];}
	if(start<'2020-03-01')return false;
	return '?orderBy="$key"&startAt="'+start+'"&endAt="'+end+'"';
}


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
	return feedList.slice(1)
}


export const addStats = (statsRegion,feedCards)=>{
	if(feedCards.length===0)return feedCards;
	let final=[feedCards[0]];
	if(statsRegion){
		final=final.concat([<StatsCard key="stats" region={statsRegion}/>])
	}
	return final.concat(feedCards.slice(1))
}


export const getData=(feedConfig,pageSize=2,lastPage=0)=>{

	console.log(pageSize,lastPage)
	if(feedConfig.type==="search"){
		console.log('searching '+feedConfig.term)
		let region='Global National';
		if(feedConfig.region!=="India & World"){
			region+=feedConfig.region
		}
		return axios({
			method: 'POST',
			url: "https://us-central1-covidwire.cloudfunctions.net/v4_search",
			data: {
				"keywords":feedConfig.term,
				"filter":{
					"key":"region",
					"value":region
				}
			}
		}).then(result => {
			if(result.data.status==="OK"){
				return {'result':orderFeed(result.data.result),'status':true}
			}else{
				return {'result':[],'status':false}
			}

		});
	}else{
		console.log(feedConfig)
		let url="https://covidwire.firebaseio.com/"+feedConfig.term
		let pageVal=formatPageUrl(lastPage,pageSize)
		console.log(url+'.json'+pageVal)
		return fetch(url+'.json'+pageVal)
					.then(
						(result)=>result.json()
					.then(
						(result)=>{
							return {'result':orderFeed(result),'status':true}
						}
					)).catch(function(error) {
							console.log('404')
    						return {'result':[],'status':false}
  					});

	}

}
