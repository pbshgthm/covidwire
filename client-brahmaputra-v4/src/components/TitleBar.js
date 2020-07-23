import React from 'react';

import './css/TitleBar.css';
import {scrollToTop} from './utils.js'

function TitleBar(props){

	return(
		<React.Fragment>
			<div onClick={()=>scrollToTop()} className="TitleBar">
			{props.showBack&&<img onClick={()=>{window.history.back()}} src={require('../assets/back.png')} alt="back" className="TitleBack"/>}
			{props.title}
			</div>
		</React.Fragment>
	)
}

export default TitleBar;
