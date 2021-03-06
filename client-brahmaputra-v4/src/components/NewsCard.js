import React, { useState, useEffect} from 'react';
import classNames from 'classnames';
import { Link } from "react-router-dom";

import './css/NewsCard.css'
import config from '../config.js'
import {formatDate,toggleSaved,isSaved} from './utils.js'


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
	msg=msg+"*Shared from https://covidwire.in* %0AA volunteer-driven platform bringing you wide-ranging news snippets on Covid-19 from prominent media of India and the world in multiple languages.%0A%0A";
	msg=msg+"Source : covidwire.in/s/"+cardData.hash;

	return msg
}


function NewsCard(props){
	const [langView,setLangView]=useState(false);
	const [cardExpand,setCardExpand]=useState(false);
	const [cardShort,setCardShort]=useState(false)
	const [noImg,setNoImg]=useState(props.cardData.img==="")
	const [saveCard,setSaveCard]=useState(false)
	const [langSel,setLangSel]=useState(props.langSel)

	useEffect(()=>{
		setCardShort(props.cardData.form==="Short")
		setCardExpand(props.cardData.form!=="Short")

		setLangSel(props.langSel)
	},[props])


	useEffect(()=>{
		setSaveCard(isSaved(props.cardData.hash))
	},[saveCard,props.cardData.hash])

	return(
		<div className={classNames("NewsCard",{
			"NewsCardHope":props.hope
		})}>
			{/*FEATURED */}
			{props.cardData.featured&&<img className="NewsCardImageFeatured" alt="Featured" src={require("../assets/featured.png")}/>}
			{/*Preview Image*/}
			{props.cardData.img&&<img className="NewsCardImage" alt="" src={props.cardData.img} onError={i => {i.target.style.display='none';setNoImg(true)}}/>}

			{/*Auto translation ribbon*/}
			{props.cardData.digests[langSel]['auto']&&<div className={classNames("NewsCardAutoRibbon",{"NewsCardAutoRibbonNoImg":noImg})}>
				{langSel} translation by Google Translate
			</div>}

			{/*Header*/}
			<div className="NewsCardRow">
				{/*Region*/}
				{<Link to={props.cardData.region!=="Hope"?("/sections/"+regCorr(props.cardData.region)):"/hope"}>
					<div className={classNames("NewsCardRegion",{
						"NewsCardRegionGlobal":props.cardData.region==="Global",
						"NewsCardRegionNational":props.cardData.region==="National",
						"NewsCardRegionHope":props.cardData.region==="Hope"
					})}>
					{regCorr(props.cardData.region)}
					</div>
				</Link>}
				{/*Domain*/}
				<div className="NewsCardDomain">{props.cardData.domain}</div>
			</div>

			{/*Digest*/}
			<div className="NewsCardHeadline" dangerouslySetInnerHTML={{__html:formatBody(props.cardData.digests[langSel]['headline'],props.mark)}}></div>

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
				<div className="NewsCardBody" dangerouslySetInnerHTML={{__html:formatBody(props.cardData.digests[langSel]['digest'],props.mark)}}></div>
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
					<img onClick={()=>{setSaveCard(!saveCard); toggleSaved(props.cardData)}} className="NewsCardSave" alt="Share" src={require("../assets/save"+(saveCard?"-yes":"-no")+".png")}/>

				</div>
				{/*Send feedback*/}
				{<div onClick={()=>props.setFeedbackData({
					'headline':props.cardData.digests[langSel]['headline'],
					'hash':props.cardData.hash,
					'region':props.cardData.region,
					'lang':langSel
				})} className={classNames("NewsCardFeedback",{
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




function formatBody(text,mark){

	text=text.trim()
	text=text.replace(/\n-/g,'\n•');
	text=text.replace(/> /g,'');
	text=text.replace(/```/g,'');
	text=text.replace(/#/g,'');
	text=text.replace(/\[x]/g,'');
	text=text.replace(/\[ ]/g,'');

	if(text[0]==="-")text='•'+text.slice(1)
	let formatedText=text.replace(/\n/g,'<br/>')
	if(mark){
		var regEx = new RegExp(mark, "ig");
		formatedText = formatedText.replace(regEx, "<span>$&</span>");
	}

	return formatedText
}


export default NewsCard;
