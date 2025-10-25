'use client';

import {useEffect, useState} from 'react';

import TitleBar from '@/components/TitleBar.js';
import Navbar from '@/components/Navbar.js';
import {formatDate, scrollToTop} from '@/components/utils.js';
import {loadStaticJson} from '@/lib/staticData';

const BLOG_CONTENT_PATH = '/data/blog/content.json';

export default function BlogPostPage({params}) {
	const blogId = params.blogid;
	const [blogData, setBlogData] = useState(null);

	useEffect(() => {
		scrollToTop(false);
		loadStaticJson(BLOG_CONTENT_PATH)
			.then((content) => setBlogData(content?.[blogId] || null))
			.catch(() => setBlogData(null));
	}, [blogId]);

	return (
		<>
			<div className="FeedPage">
				<TitleBar title="CovidWire Speaks" showBack backPath="/blog"/>
				{blogData && (
					<div className="BlogPostPage">
						<div className="BlogPostTitle">{blogData.title}</div>
						<div className="BlogPostAuthors">{blogData.authors}</div>
						<div className="BlogPostDate">
							{formatDate(`${blogData.date}T`, 'year')}{'  | '}{blogData.minutes} mins
						</div>
						<img className="BlogPostImg" src={blogData.image} alt="Blog"/>
						<div className="BlogPostBody" dangerouslySetInnerHTML={{__html: blogData.body}}></div>
						{blogData.link !== '' && (
							<div className="BlogPostLinks" dangerouslySetInnerHTML={{__html: blogData.link}}></div>
						)}
						<div className="BlogPostBio" dangerouslySetInnerHTML={{__html: blogData.author_bio}}></div>
					</div>
				)}
			</div>
			<Navbar/>
		</>
	);
}
