'use client';

import React, { useState, useEffect} from 'react';
import classNames from 'classnames';

import config from '@/config.js';
import {preventScroll} from './utils.js'

function RegionSettingBtn(props){
	return(
		<div className="RegionSettingHolder">
			<div onClick={()=>props.setShowStateMenu(true)} className="RegionSettingBtn">
				<img className="RegionSettingLocationIcon" alt="dropdown" src="/assets/location.png"/>
				{props.stateSel}
			</div>
		</div>
	)
}

function PopupMenu(props){
	let stateFallbackOpt = <div className={classNames("MenuOptFallback",{
		"MenuOption-Sel": "India & World"===props.selOpt})}
		onClick={()=>changeSelection("India & World")}>
		<i>State not listed? <u>View just India & World</u></i> </div>


	function changeSelection(selOpt){
		if(selOpt!==props.selOpt){
			props.setSelection(selOpt)
		}
		props.setVisibility(false)
	}

	return(
		<React.Fragment>
			{props.visible&&<div className="ScreenBlock" onClick={()=>props.setVisibility(false)}></div>}
			
			<div className={classNames("PopupMenu",{"PopupMenu-Sel":props.visible})}>
				<div className="MenuDesc">Select State</div>
				<div className="MenuOptionList">
					{props.options.map(x=>(
						<div key={"opt-"+x.val} onClick={()=>changeSelection(x.val)} className={classNames("MenuOption",{"MenuOption-Sel":x.val===props.selOpt})}>
							<div className="MenuOptionVal">{x.val}</div>
							<div className="MenuOptionDesc">{x.desc}</div>
						</div>
					))}
					{stateFallbackOpt}
				</div>
			</div>
		</React.Fragment>
	)
}

function RegionSetting(props){


	const [stateSel,setState]=useState(props.defaultState);
	const [showStateMenu,setShowStateMenu]=useState(false)
	const [stateOpt,setStateOpt]=useState([])


	useEffect(()=>{
		let stateOptTemp=[]
		for(const item in config.state){
			stateOptTemp.push({
				'val':item,
				'desc':config.state[item].map(x=>config.lang[x]['native']).join(' ')
			})
		}
		setStateOpt(stateOptTemp)
	},[])

	useEffect(()=>{
		preventScroll(showStateMenu)
	},[showStateMenu])

	useEffect(()=>{
		if(props.changeState)props.changeState(stateSel)
	},[props,stateSel])


	return(
		<React.Fragment>
			<RegionSettingBtn stateSel={stateSel} setShowStateMenu={setShowStateMenu}/>
			<PopupMenu selOpt={stateSel} options={stateOpt} visible={showStateMenu} setSelection={setState} setVisibility={setShowStateMenu}/>
		</React.Fragment>
	)
}

export default RegionSetting;
