import React, {useState,useEffect} from 'react';
import classNames from 'classnames'
import './css/TitleBar.css';
import {scrollToTop} from './utils.js'



function SearchInterface(props){
	const [searchFilter,setSearchFilter]=useState('Keyword')

	return(
		<React.Fragment>
			<div className="TitleBarPanel">
				<input type="text" className="TitleBarInput" onBlur={()=>props.setIsFocus(false)} onFocus={()=>props.setIsFocus(true)}/>
				<div className="TitleBarSearchFilter">

					<div className={classNames("SearchFilterBtn",
						{'SearchFilterBtnSel':'Keyword'===searchFilter})} onClick={()=>setSearchFilter('Keyword')}>
						Keyword
					</div>
					<div className={classNames("SearchFilterBtn",
						{'SearchFilterBtnSel':'Source'===searchFilter})} onClick={()=>setSearchFilter('Source')}>
					Source
					</div>
					<div className={classNames("SearchFilterBtn",{
						'SearchFilterBtnSel':'Date'===searchFilter})} onClick={()=>setSearchFilter('Date')}>
					Date
					</div>

				</div>
			</div>
		</React.Fragment>
	)
}

function TitleBar(props){

	const [isFocus,setIsFocus]=useState(false);

	return(
		<React.Fragment>
			<div onClick={()=>scrollToTop()} className="TitleBar">
			{props.showBack&&<img onClick={()=>{window.history.back()}} src={require('../assets/back.png')} alt="back" className="TitleBack"/>}
				<div className="TitleBarText">{props.title}</div>
				<img className={"TitleBarIcon"} src={require('../assets/moon.png')} alt="Search"/>
				<img className={"TitleBarIcon"} src={require('../assets/search.png')} alt="Search"/>
				<SearchInterface setIsFocus={setIsFocus}/>
			</div>
			{isFocus&&<div className="TitltBarNavBlock"></div>}
		</React.Fragment>
	)
}

export default TitleBar;
