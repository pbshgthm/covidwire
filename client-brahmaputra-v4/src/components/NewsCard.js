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

	const [viewExpand,setViewExpand]=useState(false);
	const [cardExpand,setCardExpand]=useState(props.cardData.form!=="Short");

	const [defaultLang,setDefaultLang]=useState(props.langSel)
	const [langSel,setLangSel]=useState(props.langSel)

	useEffect(()=>{
		setCardExpand(props.cardData.form!=="Short")
		setLangSel(props.langSel)
		setDefaultLang(props.langSel)
		if(props.langSel!=='English'){
			setCardExpand(!props.cardData.digests[props.langSel]['auto'])
		}
	},[props])


	return(
		<div className={classNames("NewsCard",{
			"NewsCardHide":props.cardData.digests[langSel].digest===""
		})}>
			<div className={classNames("NewsCardHeaderState",{
					"NewsCardHeaderGlobal":props.cardData.region==="Global",
					"NewsCardHeaderNational":props.cardData.region==="National",
					"NewsCardHeaderHope":props.cardData.region==="Hope"
			})}>
				<div className="NewsCardRow">
					{(props.cardData.region!=="Hope")&&<Link to={"/sections/"+regCorr(props.cardData.region)}>
						<div className={classNames("NewsCardRegion",{
							"NewsCardRegionGlobal":props.cardData.region==="Global",
							"NewsCardRegionNational":props.cardData.region==="National"
						})}>
						{regCorr(props.cardData.region)}
						</div>
					</Link>}
					<div className="NewsCardDomain">{props.cardData.domain}</div>
				</div>
				<a href={props.cardData.link} target="_blank" rel="noopener noreferrer">
					<div className="NewsCardHeadline">
						{props.cardData.digests[langSel]['headline']}
					</div>
				</a>
			</div>

			<div className="NewsCardRow">
				<a href={props.cardData.link} target="_blank" rel="noopener noreferrer">
					<div className="NewsCardSource">{props.cardData.src}</div>
				</a>
				<div className="NewsCardDate">{formatDate(props.cardData.time,"year")}</div>
			</div>

			{props.cardData.img&&<img className="NewsCardImage" alt="" src={props.cardData.img} onError={i => i.target.style.display='none'}/>}

			<div className={classNames("NewsCardContent",{
				"NewsCardContentShow":cardExpand
			})}>
				<div className="NewsCardBody">{formatBody(props.cardData.digests[langSel]['digest'])}</div>
				<div className="NewsCardRow">
					<div className="NewsCardView">
						<div className="NewsCardViewText" onClick={()=>{setViewExpand(!viewExpand)}}>language
							<img className="NewsCardViewDropDownIcon" alt="dropdown" src={require('../assets/dropdown.png')}/>
						</div>
						<div className= {classNames("NewsCardViewOpt",{"NewsCardViewOptSel":viewExpand})}>
							{Object.entries(config.lang).map(x=>(
								<div key={"viewLang-"+x[0]} onClick={()=>{setLangSel(x[0])}} className={classNames("NewsCardViewOptVal",{
									"NewsCardViewOptValSel":langSel===x[0]})
								}>{x[1]['glyph']}</div>
							))}
						</div>
					</div>
					<a href={FormatShare(props.cardData,langSel)}>
						<img className="NewsCardShare" alt="Share" src={require("../assets/whatsapp.png")}/>
					</a>
				</div>
			</div>
			<div className={classNames("NewsCardAutoTrans",{
				"NewsCardAutoTransShow":props.cardData.digests[langSel]['auto']
			})} onClick={()=>setCardExpand(!cardExpand)}>
				{"Auto Translated. Tap to "+(cardExpand?"collapse":"expand")}
			</div>

			<div className={classNames("NewsCardReadMore",{
				"NewsCardReadMoreSel":(defaultLang==="English")&&(!cardExpand)&&(props.cardData.form==="Short")&&(langSel==="English")
			})} onClick={()=>{setCardExpand(true)}}>
				Tap to read more
			</div>
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
