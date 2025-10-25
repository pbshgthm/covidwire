'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {scrollToTop} from './utils.js';



function TitleBar(props){

	const router = useRouter();

	return(
		<React.Fragment>
			<div onClick={()=>scrollToTop()} className="TitleBar">
			{props.showBack&&<img onClick={(e)=>{e.stopPropagation();props.backPath?router.push(props.backPath):router.back();}} src="/assets/back.png" alt="back" className="TitleBack"/>}
				<div className="TitleBarText">{props.title}</div>
			</div>
		</React.Fragment>
	)
}

export default TitleBar;
