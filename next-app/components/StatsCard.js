'use client';

import React, { useState, useEffect} from 'react';

import {formatDate} from './utils.js'
import {loadStaticJson} from '@/lib/staticData';
import {getSiteOrigin} from '@/lib/siteConfig';


function formatNum(num){
	num=num.toString()
	return num.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
}

function statsShareText(statsRegion,statsData){
	var total=statsData.total.recovered+statsData.total.active+statsData.total.deceased;
	let msg="whatsapp://send?text=";
	const siteOrigin = getSiteOrigin().replace(/\/$/, '');

	msg=msg+"*Covid19 Numbers - "+statsRegion+"* %0A%0A";
	msg=msg+'_'+formatDate(statsData.date)+"_ %0A%0AConfirmed  : *%2B"+formatNum(statsData.today.confirmed)+"* %0ARecovered  : *%2B"+formatNum(statsData.today.recovered)+"* %0ADeceased   : *%2B"+formatNum(statsData.today.deceased)+"* %0A%0A*Total* %0ARecovered  : *"+formatNum(statsData.total.recovered)+"* %0AActive          : *"+formatNum(statsData.total.active)+"* %0ADeceased   : *"+formatNum(statsData.total.deceased)+"* %0A%0ARecovery Rate : *"

	msg=msg+Math.round(100*statsData.total.recovered/total)+`%* %0A%0A*Shared from ${siteOrigin}* %0AA volunteer-driven platform bringing you wide-ranging news snippets on Covid-19 from prominent media of India and the world in multiple languages.%0A%0ASource : covid19india.org`

	return msg
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

	const [statsData,setStatsData]=useState(null);
	const [statsReady,setStatsReady]=useState(false);
	const [statsRegion,setStatsRegion]=useState(props.region==="India & World"?"India":props.region);

	useEffect(()=>{
		setStatsRegion(props.region==="India & World"?"India":props.region);
	},[props.region]);

	useEffect(()=>{
		loadStaticJson('/data/stats.json')
			.then((allStats)=>{
				const regionStats = allStats?.[statsRegion];
				if(regionStats){
					setStatsData(regionStats);
					setStatsReady(true);
				}else{
					setStatsData(null);
					setStatsReady(false);
				}
			})
			.catch(()=>{
				setStatsData(null);
				setStatsReady(false);
			});
	},[statsRegion]);

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
				<a href={statsShareText(statsRegion,statsData)}>
					<img className="StatsCardShare" src="/assets/whatsapp.png" alt="Share"/>
				</a>
			</div>
		</div>
	)
}




export default StatsCard;
