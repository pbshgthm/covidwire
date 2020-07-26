import React, { useState, useEffect} from 'react';
import TitleBar from '../components/TitleBar.js'
import '../App.css'
import {formatDate} from '../components/utils.js'


function richFormat(text){
	console.log(text)

	var reBold=/\*\*(.*)\*\*/g
	text=text.replace(reBold,function(a,b){
		return '<div class="BlogPostBodyBold">'+b+'</div>'
	})
	var reItalics=/_(.*)_/g
	text=text.replace(reItalics,function(a,b){
		return '<span class="BlogPostBodyItalics">'+b+'</span>'
	})
	text=text.replace(/\n/g,'<br/>')
	return text
}


function BlogPost(props){

	const [blogData,setBlogData]=useState(false)
	useEffect(()=>{
		let blogid= props.match.params.blogid;
		let url="https://covidwire.firebaseio.com/v3/blog/content/"+blogid
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
				<div className="BlogPostAuthors">{blogData.authors.join(', ')}</div>
				<div className="BlogPostDate">{formatDate(blogData.date,'year')+" "+' | '+blogData.mins+' mins'}</div>
				<img className="BlogPostImg" src={blogData.img} alt="BlogImg"/>
				<div className="BlogPostBody" dangerouslySetInnerHTML={{__html: richFormat(blogData.body)}}></div>
			</div>}
		</div>
	);
}

export default BlogPost;
