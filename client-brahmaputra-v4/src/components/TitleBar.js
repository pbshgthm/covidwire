import React, {useState,useEffect,useRef} from 'react';
import classNames from 'classnames'
import './css/TitleBar.css';
import {scrollToTop} from './utils.js';


function SearchInterface(props){
	const searchInput = useRef(null);
	const [searchFilter,setSearchFilter]=useState('Keyword');
	const [placeHolder,setPlaceHolder]=useState('Search...')
	const [keyWord,setKeyWord]=useState('')

	const handleKeyDown = (event) => {
    	if (event.key === 'Enter') {
			hitSearch();
    	}
  	}

	useEffect(() => {
    	searchInput.current.focus();
  	}, []);

	useEffect(()=>{
		if(keyWord.length===0){setPlaceHolder('Search...')}
		else{setPlaceHolder('')}
	},[keyWord])

	function hitSearch(){
		searchInput.current.blur()
		props.setSearchKey(keyWord)
	}

	return(
		<React.Fragment>
			<div className="TitleBarSearchPanel">
				<img onClick={(e)=>{e.stopPropagation();props.setShowSearch(false)}} className={"TitleBack"} src={require('../assets/back.png')} alt="Close"/>

				<input ref={searchInput} type="text" className="TitleBarInput" onBlur={()=>props.setNavHide(false)}
				onFocus={()=>props.setNavHide(true)}
				onInput={(e)=>setKeyWord(e.target.value)}
				onKeyDown={handleKeyDown}/>

				<img className={"TitleBarSearchBtn"} src={require('../assets/search.png')} alt="Search" onClick={()=>hitSearch()}/>
				<div className="SearchPlaceholder">{placeHolder}</div>
			</div>
		</React.Fragment>
	)
}


function TitleBar(props){

	const [showSearch,setShowSearch]=useState(false)
	const [searchKey,setSearchKey]=useState('')


	useEffect(()=>{
		if(searchKey.length===0)return;

		props.setFeedConfig({
			term:searchKey,
			type:'search',
			region:props.feedConfig.region,
			stats:false
		})
	},[searchKey,props.feedConfig.region])


	useEffect(()=>{
		if(showSearch)return;
		setSearchKey('')
		props.setFeedConfig({
			term:'feed/'+props.feedConfig.region,
			type:'feed',
			region:props.feedConfig.region,
			stats:false
		})
	},[showSearch])



	return(
		<React.Fragment>
			<div onClick={()=>scrollToTop()} className="TitleBar">
			{props.showBack&&<img onClick={()=>{window.history.back()}} src={require('../assets/back.png')} alt="back" className="TitleBack"/>}
				<div className="TitleBarText">{props.title}</div>
				<img className={"TitleBarIcon"} src={require('../assets/moon.png')} alt="Dark"/>
				{props.search&&<img onClick={(e)=>{e.stopPropagation();setShowSearch(true)}} className={"TitleBarIcon"} src={require('../assets/search.png')} alt="Search"/>}
				{showSearch&&<SearchInterface setNavHide={props.setNavHide} setShowSearch={setShowSearch} setSearchKey={setSearchKey}/>}
			</div>
		</React.Fragment>
	)
}

export default TitleBar;
