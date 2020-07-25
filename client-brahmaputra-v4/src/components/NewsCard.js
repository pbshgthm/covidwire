import React, { useState, useEffect} from 'react';
import classNames from 'classnames';
import { Link } from "react-router-dom";

import './css/NewsCard.css'
import config from '../config.js'
import {formatDate} from './utils.js'


function regCorr(x){
	let commonDict={
		"Global":"World",
		"National":"India"
	}
	return (x in commonDict)?commonDict[x]:x
}


function FormatShare(cardData,langSel){
	let msg=""

	msg="whatsapp://send?text=";
	if(cardData.digests[langSel]['auto']){
		msg=msg+"*_This is an Auto Translated version_* %0A%0A";
	}
	msg=msg+"*"+cardData.digests[langSel]['headline'].trim()+'*  %0A%0A';
	msg=msg+'_'+formatDate(cardData.time)+'  |  '+cardData.src+'_ %0A%0A';
	msg=msg+cardData.digests[langSel]['digest']+'%0A%0A';;
	msg=msg+"*Shared from https://covidwire.in* %0AAuthentic, verified and factful information about Covid-19 pandemic, in an easy to read and share format, in multiple regional languages.%0A%0A";
	msg=msg+"Source : covidwire.in/s/"+cardData.hash;

	return msg
}


function NewsCard(props){

	const [langView,setLangView]=useState(false);
	const [cardExpand,setCardExpand]=useState(false);
	const [cardShort,setCardShort]=useState(false)
	const [noImg,setNoImg]=useState(props.cardData.img==="")
	const [saveCard,setSaveCard]=useState(false)
	const [defaultLang,setDefaultLang]=useState(props.langSel)
	const [langSel,setLangSel]=useState(props.langSel)

	useEffect(()=>{
		setCardShort(props.cardData.form==="Short")
		setCardExpand(props.cardData.form!=="Short")

		//for no collapsing for indian languages
		//setCardShort(props.cardData.form==="Short"&&props.cardData.langSel==="English")
		//setCardExpand(props.cardData.form!=="Short"||props.cardData.langSel!=="English")

		setLangSel(props.langSel)
		setDefaultLang(props.langSel)
	},[props])


	return(
		<div className={classNames("NewsCard",{
			"NewsCardHide":props.cardData.digests[langSel].digest===""
		})}>
			{/*Preview Image*/}
			{props.cardData.img&&<img className="NewsCardImage" alt="" src={props.cardData.img} onError={i => {i.target.style.display='none';setNoImg(true);console.log('sdsds')}}/>}

			{/*Auto translation ribbon*/}
			{props.cardData.digests[langSel]['auto']&&<div className={classNames("NewsCardAutoRibbon",{"NewsCardAutoRibbonNoImg":noImg})}>
				This content is Auto-translated to {langSel}
			</div>}

			{/*Header*/}
			<div className="NewsCardRow">
				{/*Region*/}
				{(props.cardData.region!=="Hope")&&<Link to={"/sections/"+regCorr(props.cardData.region)}>
					<div className={classNames("NewsCardRegion",{
						"NewsCardRegionGlobal":props.cardData.region==="Global",
						"NewsCardRegionNational":props.cardData.region==="National"
					})}>
					{regCorr(props.cardData.region)}
					</div>
				</Link>}
				{/*Domain*/}
				<div className="NewsCardDomain">{props.cardData.domain}</div>
			</div>

			{/*Digest*/}
			<div className="NewsCardHeadline">
					{props.cardData.digests[langSel]['headline']}
			</div>

			{/*Source,date*/}
			<div className="NewsCardRow">
				<a href={props.cardData.link} target="_blank" rel="noopener noreferrer">
					<div className="NewsCardSource">{props.cardData.src}</div>
				</a>
				<div className="NewsCardDate">{formatDate(props.cardData.time,"year")}</div>
			</div>

			{/*Body*/}
			<div className={classNames("NewsCardContent",{
				"NewsCardContentShow":cardExpand
			})}>
				{/*Digest*/}
				<div className="NewsCardBody">
					{formatBody(props.cardData.digests[langSel]['digest'])}
				</div>
				{/*Footer*/}
				<div className="NewsCardRow">
					{/*Lang setting*/}
					<div className="NewsCardLang">
						{
							Object.entries(config.lang).map(x=>(
								<div key={x[0]} className={classNames("NewsCardLangBtn",{
									"NewsCardLangBtnSel":langSel===x[0],
									"NewsCardLangBtnView":langView
								})} onClick={()=>{setLangView(!langView);setLangSel(x[0])}}>
									{x[1].glyph}
								</div>
							))
						}
					</div>
					{/*Whatsapp Share*/}
					<a href={FormatShare(props.cardData,langSel)}>
						<img className="NewsCardShare" alt="Share" src={require("../assets/whatsapp.png")}/>
					</a>
					{/*Save card*/}
					<img onClick={()=>setSaveCard(!saveCard)} className="NewsCardSave" alt="Share" src={require("../assets/save"+(saveCard?"-yes":"-no")+".png")}/>

				</div>
				{/*Send feedback*/}
				{<div onClick={()=>props.setFeedbackData(props.cardData.digests[langSel]['digest'])} className={classNames("NewsCardFeedback",{
					"NewsCardFeedbackHide":langView})}>
					send feedback
				</div>}
			</div>
			{/*Expand button*/}
			{cardShort&&<div className="NewsCardExpand"
				onClick= {()=>setCardExpand(!cardExpand) }>
				{cardExpand?"Tap to Hide Summary":"Tap to Read Summary"}
			</div>}
		</div>
	)
}


function formatBody(text){
	text=text.trim()
	text=text.replace(/\n-/g,'\n•');
	text=text.replace(/> /g,'');
	text=text.replace(/```/g,'');
	text=text.replace(/#/g,'');
	text=text.replace(/\[x]/g,'');
	text=text.replace(/\[ ]/g,'');

	let formatedText=text.split('\n').map((item, i) => (
    	<span key={'line-'+i}>{item}<br/></span>
	));
	return formatedText
}


export default NewsCard;
