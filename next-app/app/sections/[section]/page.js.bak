'use client';

import {use, useEffect, useMemo, useState} from 'react';

import TitleBar from '@/components/TitleBar.js';
import LangSetting from '@/components/LangSetting.js';
import SearchFeed from '@/components/SearchFeed.js';
import Navbar from '@/components/Navbar.js';
import {scrollToTop, urlDecode} from '@/components/utils.js';

const DEFAULT_LANG = 'English';

const normalizeSection = (value) => {
	const mapping = {
		'World': 'Global',
		'India': 'National'
	};
	return mapping[value] || value;
};

const readLang = () => {
	if (typeof window === 'undefined') return DEFAULT_LANG;
	const stored = window.localStorage.getItem('cwv3-lang1');
	return stored === null ? DEFAULT_LANG : stored;
};

const writeLang = (value) => {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem('cwv3-lang1', value);
};

export default function SectionPage({params}) {
	const {section: sectionParam = ''} = use(params);
	const sectionName = urlDecode(sectionParam);
	const [langSel, setLangSel] = useState(DEFAULT_LANG);

	useEffect(() => {
		setLangSel(readLang());
		scrollToTop(false);
	}, []);

	useEffect(() => {
		writeLang(langSel);
	}, [langSel]);

	const feedConfig = useMemo(() => {
		const key = normalizeSection(sectionName);
		return {
			term: `section/${key}`,
			type: 'section',
			region: sectionName,
			stats: false
		};
	}, [sectionName]);

	return (
		<>
			<div className="FeedPage">
				<TitleBar title={sectionName} showBack backPath="/sections"/>
				<LangSetting defaultLang={langSel} changeLang={setLangSel}/>
				<div className="FeaturedDesc">A handpicked collection of our favorite articles!</div>
				<SearchFeed langSel={langSel} pageSize={5} feedConfig={feedConfig}/>
			</div>
			<Navbar/>
		</>
	);
}
