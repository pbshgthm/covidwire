import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import './css/Components.css';
import {scrollToTop} from './utils.js'

function TitleBar(props){
	const _isMounted = useRef(true);
	const [titleBarSel,setTitleBarSel]=useState(false);

	useEffect(() => {
    	return () => {
        	_isMounted.current = false;
    	}
  	}, []);

	window.addEventListener('scroll', ()=>{
		if(!_isMounted.current)return;
		if (document.documentElement.scrollTop>200 ){
		   setTitleBarSel(true)
	   }
	   else{
		   setTitleBarSel(false)
	   }
	});

	return(
		<React.Fragment>
			<div onClick={()=>scrollToTop()} className={classNames("TitleBar",{"TitleBarSel":titleBarSel})}>
			{props.showBack&&<img onClick={()=>{window.history.back()}} src={require('../assets/back.png')} alt="back" className="TitleBack"/>}
			{props.title}
			</div>
		</React.Fragment>
	)
}

export default TitleBar;
