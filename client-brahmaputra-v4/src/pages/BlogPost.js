import React, { useState, useEffect} from 'react';
import TitleBar from '../components/TitleBar.js'
import '../App.css'
import {formatDate} from '../components/utils.js'



function BlogPost(props){

	const [blogData,setBlogData]=useState(false)
	useEffect(()=>{
		let blogid= props.match.params.blogid;
		let url="https://covidwire.firebaseio.com/blog/content/"+blogid
		fetch(url+'.json')
			.then(
				(result)=>result.json()
			.then(
				(result)=>{
					console.log(result)
					setBlogData(result)
				}
		))
	},[props.match.params.blogid])


	return (
		<div className="FeedPage">
			<TitleBar title="CovidWire Speaks" showBack={true}/>
			{blogData&&<div className="BlogPostPage">
				<div className="BlogPostTitle">{blogData.title}</div>
				<div className="BlogPostAuthors">{blogData.authors}</div>
				<div className="BlogPostDate">{formatDate(blogData.date+'T','year')+'  | '+blogData.minutes+' mins'}</div>
				<img className="BlogPostImg" src={blogData.image} alt="BlogImg"/>
				<div className="BlogPostBody" dangerouslySetInnerHTML={{__html:blogData.body}}></div>
				{(blogData.link!=="")&&<div className="BlogPostLinks" dangerouslySetInnerHTML={{__html:blogData.link}}></div>}
				<div className="BlogPostBio" dangerouslySetInnerHTML={{__html:blogData.author_bio}}></div>
			</div>}
		</div>
	);
}

export default BlogPost;
