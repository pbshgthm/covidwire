import React from 'react';
import NewsCard from './NewsCard.js'

export const formatPageUrl = (pageNum,pageSize=1)=>{
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

export const formatDate = (date_str,format="day")=>{
	date_str=date_str.split('T')[0]
	let day_dict=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
	let month_dict = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	let date_arr = date_str.split('-');
	let day = new Date(date_str);
	day=day_dict[day.getDay()];
	if(format==="year"){
		return Number(date_arr[2])+' '+month_dict[Number(date_arr[1]) - 1]+' '+date_arr[0]
	}
  	return Number(date_arr[2])+' '+month_dict[Number(date_arr[1]) - 1]+', '+day
}

export const orderFeed = (rawFeed)=>{
	let orderedFeed=[]
	for(const date in rawFeed){
		let day_news=Object.entries(rawFeed[date])
		day_news.sort(function(a,b){
			if(a[1].time>b[1].time)return -1;
			if(a[1].time<b[1].time)return 1;
			return 0
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

export const feedFormat = (feedData,langSel,setFeedbackData)=>{
	let feedList=[]
	feedData.forEach(dayFeed=>{
		feedList.push(<div className="FeedDateBox" key={dayFeed[0]}>{formatDate(dayFeed[0])}</div>)
		dayFeed[1].forEach((cardData,i) => {
			feedList.push(<NewsCard key={cardData[1].hash} cardData={cardData[1]} langSel={langSel} setFeedbackData={setFeedbackData}/>)
		});

	})
	return feedList.slice(1)
}

export const scrollToTop = (animate=true)=>{
	if(animate){
		const c = document.documentElement.scrollTop || document.body.scrollTop;
		if (c > 0) {
			window.requestAnimationFrame(scrollToTop);
			window.scrollTo(0, c - c / 8);
		}
	}
	else(window.scrollTo(0,0));
};

export const urlEncode = (url)=>{
	return url.toLowerCase().replace(/ /g,'+')
}

export const urlDecode = (url)=>{
	return url.split('+').map(x=>x.charAt(0).toUpperCase() + x.slice(1)).join(' ').replace(' And ',' and ')
}

export const preventScroll=(noScroll)=>{
	if(noScroll){
		document.body.style.overflow = "hidden"
	}else{
		document.body.style.overflow = "scroll"
	}
}


export const toggleSaved=(cardData)=>{
	var savedCards=getSaved()
	console.log(savedCards)
	if(cardData.hash in savedCards){
		delete savedCards[cardData.hash];
	}else{
		savedCards[cardData.hash]=cardData;
	}
	localStorage.setItem('testObject2', JSON.stringify(savedCards));
}

export const isSaved=(hash)=>{
	var savedCards=getSaved()
	console.log(savedCards)
	return (hash in savedCards)
}

export const getSaved=()=>{
	var savedCards = localStorage.getItem('testObject2');
	savedCards=JSON.parse(savedCards);

	if(savedCards===null)return {}
	return savedCards

}
