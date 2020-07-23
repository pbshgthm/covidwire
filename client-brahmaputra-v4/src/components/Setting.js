import React, { useState, useEffect, useRef} from 'react';
import classNames from 'classnames';

import './css/Setting.css'
import config from '../config.js'

function SettingBtnHolder(props){
	return(
		<div className={classNames("SettingBtnHolder", {"SettingBtnHolderFull":props.fullSetting})}>

			{props.fullSetting && <div onClick={()=>props.setShowStateMenu(true)} className="SettingBtn">{props.stateSel}
				<img className="SettingDropDownIcon" alt="dropdown" src={require('../assets/dropdown.png')}/>
			</div>}

			<div onClick={()=>props.setShowLangMenu(true)} className={classNames("SettingBtn",{"SettingBtnFull":props.fullSetting})}>
			{config.lang[props.langSel]['native']}
				<img className="SettingDropDownIcon" alt="dropdown" src={require('../assets/dropdown.png')}/>
			</div>

		</div>
	)
}

function PopupMenu(props){
	let stateFallbackOpt = <div className={classNames("MenuOptFallback","MenuOption",{"MenuOption-Sel":"Common"===props.selOpt})} onClick={()=>changeSelection("Common")}>

		State not found?
		<i> <u style={{"opacity":0.7}}>view common news instead</u></i></div>


	function changeSelection(selOpt){
		if(selOpt!==props.selOpt){
			props.setSelection(selOpt)
		}
		props.setVisibility(false)
	}

	return(
		<React.Fragment>
			<div className={classNames({"ScreenBlock":props.visible})} onClick={()=>props.setVisibility(false)}></div>
			<div className={classNames("PopupMenu",{"PopupMenu-Sel":props.visible})}>
				<div className="MenuDesc">{props.desc}</div>
				<div className="MenuOptionList">
					{props.options.map(x=>(
						<div key={"opt-"+x.val} onClick={()=>changeSelection(x.val)} className={classNames("MenuOption",{"MenuOption-Sel":x.val===props.selOpt})}>
							<div className="MenuOptionVal">{
								(props.stateFallback)?x.val:config.lang[x.val]['native']
							}</div>
							<div className="MenuOptionDesc">{x.desc}</div>
						</div>
					))}
					{props.stateFallback&&stateFallbackOpt}
				</div>
			</div>
		</React.Fragment>
	)
}

function Setting(props){

	let fullSetting=('changeState' in props);
	const isInitialMount = useRef(true);

	const [stateSel,setState]=useState(props.defaultState||'Delhi');
	const [langSel,setLang]=useState(props.defaultLang);

	const [showStateMenu,setShowStateMenu]=useState(false)
	const [showLangMenu,setShowLangMenu]=useState(false)

	const [stateOpt,setStateOpt]=useState([])
	const [langOpt,setLangOpt]=useState([])


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

		let langOptTemp=[]
		for(const item in config.lang){
			let desc="";
			if(stateSel!=="Common"){
				desc=fullSetting?((config.state[stateSel].includes(item))?'':'Auto-tranlsation'):""
			}
			langOptTemp.push({
				'val':item,
				'desc':desc
			})
			langOptTemp.sort(function(a,b){return a['desc'].length-b['desc'].length})
		}
		setLangOpt(langOptTemp);
	},[stateSel,fullSetting])


	useEffect(()=>{
		if(stateSel==="Common")return;
		if (isInitialMount.current) {
     		isInitialMount.current = false;
  		}else {
			setLang(config.state[stateSel][0])
		}
	},[stateSel])


	useEffect(()=>{
		if(props.changeState)props.changeState(stateSel)
	},[props,stateSel])

	useEffect(()=>{
		setTimeout(()=>{
			props.changeLang(langSel)
		},200)
	},[props,langSel])

	return(
		<React.Fragment>
			<SettingBtnHolder fullSetting={fullSetting} stateSel={stateSel} langSel={langSel} setShowLangMenu={setShowLangMenu} setShowStateMenu={setShowStateMenu}/>

			{fullSetting&&<PopupMenu selOpt={stateSel} options={stateOpt} visible={showStateMenu} desc="Select State" setSelection={setState} setVisibility={setShowStateMenu} stateFallback="true"/>}

			<PopupMenu selOpt={langSel} options={langOpt} visible={showLangMenu} desc="Select Language"  setSelection={setLang} setVisibility={setShowLangMenu}/>

		</React.Fragment>
	)
}

export default Setting;
