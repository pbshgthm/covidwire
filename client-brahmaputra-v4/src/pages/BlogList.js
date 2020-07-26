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
		let url="https://covidwire.firebaseio.com/v3/blog/list"
		fetch(url+'.json')
			.then(
				(result)=>result.json()
			.then(
				(result)=>{
					setBlogList(Object.values(result).sort(
						function(a,b){return b.id[3]-a.id[3]}
					))
				}
		))
	},[])


	return (
		<div className="FeedPage">
			<TitleBar title="CovidWire Speaks"/>
			<div className="BlogListFeed">
				{blogList.map(x=>(
					<Link key={x.id} to={"blog/"+x.id}>
						<div  className="BlogListCard">
							<img className="BlogListImg" src={x.img} alt="BlogImg"/>
							<div className="BlogListTitle">{x.title}</div>
							<div className="BlogListAuthors">{x.authors.join(', ')}</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

export default BlogList;
