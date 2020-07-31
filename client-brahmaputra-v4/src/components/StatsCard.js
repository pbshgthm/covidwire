import React, { useState, useEffect, useRef} from 'react';

import './css/StatsCard.css'
import {formatDate} from './utils.js'


function formatNum(num){
	num=num.toString()
	return num.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
}



function StatsChart(props){
	var total=props.data.recovered+props.data.active+props.data.deceased;
	var ang={
		'dec':360*props.data.deceased/total,
		'act':360*props.data.deceased/total+360*props.data.active/total
	}
	var rec=Math.round(100*props.data.recovered/total)+"%"
	var grad="conic-gradient(#6D757C "+ang['dec']+"deg,#CC7A7A 0 "+ang['act']+"deg, #5CB760 0)"
	return (
		<div className="StatsCardChart">
			<div className="StatsCardPie" style={
				{backgroundImage: grad}
			}></div>
			<div className="StatsCardPieCenter">{rec}</div>
		</div>
  	)
}



function StatsCard(props){

	const [statsData,setStatsData]=useState({});
	const [statsReady,SetStatsReady]=useState(false);
	const [statsRegion,setStatsRegion]=useState(props.region==="India & World"?"India":props.region);

	useEffect(()=>{
		let url="https://covidwire.firebaseio.com/stats/"+statsRegion
		fetch(url+'.json')
			.then(
				(result)=>result.json()
			.then(
				(result)=>{
					setStatsData(result)
					SetStatsReady(true)
				}
		))
	},[props.region])

	return (
		statsReady&&<div className="StatsCard">
			<div className="StatsCardName">{"Covid19 numbers - "+statsRegion}</div>
			<div className="StatsCardLabel">{formatDate(statsData.date)}</div>
			<div className="StatsCardContainer">
				<div className="StatsCardTodayCol">
					<div className="StatsCardTodayLabel">Confirmed</div>
					<div className="StatsCardTodayCon">+{formatNum(statsData.today.confirmed)}</div>
				</div>
				<div className="StatsCardTodayCol">
					<div className="StatsCardTodayLabel">Recovered</div>
					<div className="StatsCardTodayRec">+{formatNum(statsData.today.recovered)}</div>
				</div>
				<div className="StatsCardTodayCol">
					<div className="StatsCardTodayLabel">Deceased</div>
					<div className="StatsCardTodayDec">+{formatNum(statsData.today.deceased)}</div>
				</div>
			</div>
			<div className="StatsCardLabel">Cumulative</div>
			<div className="StatsCardContainer">
				<div className="StatsCardTotalCol">
					<div className="StatsCardTotalRow">
						<div className="StatsCardTotalLabel">Recovered</div>
						<div className="StatsCardTotalRec">{formatNum(statsData.total.recovered)}</div>
					</div>
					<div className="StatsCardTotalRow">
						<div className="StatsCardTotalLabel">Active</div>
						<div className="StatsCardTotalCon">{formatNum(statsData.total.active)}</div>
					</div>
					<div className="StatsCardTotalRow">
						<div className="StatsCardTotalLabel">Deceased</div>
						<div className="StatsCardTotalDec">{formatNum(statsData.total.deceased)}</div>
					</div>
				</div>
				<div className="StatsCardTotalCol">
					<StatsChart data={statsData.total}/>
				</div>
			</div>
			<div className="StatsCardFooter">
				<div className="StatsCardSource">
					<a target="_blank" rel="noopener noreferrer" href="https://covid19india.org">https://covid19india.org</a>
				</div>
				<img className="StatsCardShare" src={require("../assets/whatsapp.png")} alt="Share"/>
			</div>
		</div>
	)
}




export default StatsCard;
