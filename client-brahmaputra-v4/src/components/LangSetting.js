import React, { useState, useEffect} from 'react';
import classNames from 'classnames';

import './css/LangSetting.css'
import config from '../config.js'


function LangSetting(props){


	const [langSel,setLangSel]=useState(props.defaultLang);
	const [langOpt,setLangOpt]=useState([])


	useEffect(()=>{
		let langOptTemp=Object.entries(config.lang).map(x=>({
			'val':x[0],
			'glyph':x[1]['glyph']
		}))
		setLangOpt(langOptTemp)
	},[])


	useEffect(()=>{
		if(props.changeLang)props.changeLang(langSel)
	},[props,langSel])


	return(
		<div className="LangSetting">
			{langOpt.map(x=>(
				<div key={x.val} className={classNames("LangSettingBtn",{"LangSettingBtn-sel":x.val===langSel})} onClick={()=>setLangSel(x.val)}>{x.glyph}</div>
			))}
		</div>

	)
}

export default LangSetting;
