'use client';

import {useEffect, useMemo, useState} from 'react';
import classNames from 'classnames';

import LangSetting from '@/components/LangSetting.js';
import SearchFeed from '@/components/SearchFeed.js';
import Navbar from '@/components/Navbar.js';
import {scrollToTop} from '@/components/utils.js';

const DEFAULT_LANG = 'English';

const readLang = () => {
	if (typeof window === 'undefined') return DEFAULT_LANG;
	const stored = window.localStorage.getItem('cwv3-lang1');
	return stored === null ? DEFAULT_LANG : stored;
};

const writeLang = (value) => {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem('cwv3-lang1', value);
};

export default function HopePage() {
	const [langSel, setLangSel] = useState(DEFAULT_LANG);
	const [showTitle, setShowTitle] = useState(false);
	const feedConfig = useMemo(() => ({
		term: 'hope',
		type: 'feed',
		region: 'Hope',
		stats: false
	}), []);

	useEffect(() => {
		setLangSel(readLang());
		scrollToTop(false);
	}, []);

	useEffect(() => {
		writeLang(langSel);
	}, [langSel]);

	useEffect(() => {
		const handleScroll = () => {
			if (typeof window === 'undefined') return;
			const scrolled = document.documentElement.scrollTop;
			setShowTitle(scrolled > 150);
		};
		handleScroll();
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className="FeedPage">
			<div className={classNames("HopeTitlebar",{"HopeTitlebarSel":showTitle})}>
				<img className="HopeTitlebarImg" src="/assets/hope-title.png" alt="Hope"/>
			</div>
			<img className="HopeHeader" src="/assets/hope-title.png" alt="Hope"/>
			<div className="HopeBg"></div>
			<LangSetting defaultLang={langSel} changeLang={setLangSel} hope/>
			<div className="HopeDesc">Dearly curated with the hope to bring positive news to light</div>
			<SearchFeed langSel={langSel} pageSize={5} feedConfig={feedConfig} hope/>
			<Navbar/>
		</div>
	);
}
