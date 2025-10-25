'use client';

import React from 'react';
import {useNavigate} from 'react-router-dom';
import {scrollToTop} from './utils.js';



function TitleBar(props){

	const navigate = useNavigate();

	return(
		<React.Fragment>
			<div onClick={()=>scrollToTop()} className="TitleBar">
			{props.showBack&&<img onClick={(e)=>{e.stopPropagation();props.backPath?navigate(props.backPath):navigate(-1);}} src="/assets/back.png" alt="back" className="TitleBack"/>}
				<div className="TitleBarText">{props.title}</div>
			</div>
		</React.Fragment>
	)
}

export default TitleBar;
