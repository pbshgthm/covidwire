'use client';

import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import TitleBar from '@/components/TitleBar.js';
import Navbar from '@/components/Navbar.js';
import {scrollToTop} from '@/components/utils.js';
import {loadStaticJson} from '@/lib/staticData';

const BLOG_LIST_PATH = '/data/blog/list.json';

export default function BlogListPage() {
	const [blogList, setBlogList] = useState([]);

	useEffect(() => {
		scrollToTop(false);
		loadStaticJson(BLOG_LIST_PATH)
			.then((result) => {
				const list = Object.values(result || {}).sort((a, b) => b.order - a.order);
				setBlogList(list);
			})
			.catch(() => setBlogList([]));
	}, []);

	return (
		<>
			<div className="FeedPage">
				<TitleBar title="CovidWire Speaks"/>
				<div className="BlogListFeed">
					<div className="BlogDesc">A collection of analysis and stories from our community</div>
					<div className="BlogDisclaimer">*inclusive of the author's perspectives and biases.</div>
					{blogList.map((blog) => (
						<Link key={blog.order} to={`/blog/${`csw${blog.order}`}`}>
							<div className="BlogListCard">
								<img className="BlogListImg" src={blog.image} alt="Blog"/>
								<div className="BlogListTitle">{blog.title}</div>
								<div className="BlogListAuthors">{blog.authors}</div>
							</div>
						</Link>
					))}
				</div>
			</div>
			<Navbar/>
		</>
	);
}
