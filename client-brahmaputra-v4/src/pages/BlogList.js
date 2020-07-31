import React, { useState, useEffect} from 'react';
import { Switch,Route,Link } from "react-router-dom";
import TitleBar from '../components/TitleBar.js'
import {scrollToTop} from '../components/utils.js'

import BlogPost from './BlogPost.js'


function BlogList() {
	return (
  	  <Switch>
  		  <Route exact path="/blog" component={BlogListPage}/>
  		  <Route path="/blog/:blogid" component={BlogPost}/>
  	  </Switch>
    );
}

function BlogListPage(props){

	const [blogList,setBlogList]=useState([])

	useEffect(()=>{
		scrollToTop(false)
		let url="https://covidwire.firebaseio.com/blog/list"
		fetch(url+'.json')
			.then(
				(result)=>result.json()
			.then(
				(result)=>{
					setBlogList(Object.values(result).sort(
						function(a,b){return b.order-a.order}
					))
				}
		))
	},[])


	return (
		<div className="FeedPage">
			<TitleBar title="CovidWire Speaks"/>
			<div className="BlogListFeed">
				{blogList.map(x=>(
					<Link key={x.order} to={"blog/csw"+x.order}>
						<div  className="BlogListCard">
							<img className="BlogListImg" src={x.image} alt="BlogImg"/>
							<div className="BlogListTitle">{x.title}</div>
							<div className="BlogListAuthors">{x.authors}</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

export default BlogList;
