import React, {useState,useEffect,useRef} from 'react';
import classNames from 'classnames'
import './css/TitleBar.css';
import {scrollToTop} from './utils.js';



function TitleBar(props){



	return(
		<React.Fragment>
			<div onClick={()=>scrollToTop()} className="TitleBar">
			{props.showBack&&<img onClick={(e)=>{e.stopPropagation();window.location=props.backPath}} src={require('../assets/back.png')} alt="back" className="TitleBack"/>}
				<div className="TitleBarText">{props.title}</div>
			</div>
		</React.Fragment>
	)
}

export default TitleBar;
