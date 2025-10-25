'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import TitleSearchBar from '@/components/TitleSearchBar.js';
import RegionSetting from '@/components/RegionSetting.js';
import LangSetting from '@/components/LangSetting.js';
import SearchFeed from '@/components/SearchFeed.js';
import Navbar from '@/components/Navbar.js';

const DEFAULT_STATE = 'Delhi';
const DEFAULT_LANG = 'English';

const readStorage = (key, fallback) => {
	if (typeof window === 'undefined') return fallback;
	const value = window.localStorage.getItem(key);
	return value === null ? fallback : value;
};

const writeStorage = (key, value) => {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(key, value);
};

export default function HomePage() {
	const [stateSel, setStateSel] = useState(DEFAULT_STATE);
	const [langSel, setLangSel] = useState(DEFAULT_LANG);
	const [navHide, setNavHide] = useState(false);
	const [hydrated, setHydrated] = useState(false);
	const router = useRouter();

	const [feedConfig, setFeedConfig] = useState({
		term: `feed/${DEFAULT_STATE}`,
		type: 'feed',
		region: DEFAULT_STATE,
		stats: false
	});

	useEffect(() => {
		setStateSel(readStorage('cwv3-state1', DEFAULT_STATE));
		setLangSel(readStorage('cwv3-lang1', DEFAULT_LANG));
		if (typeof window !== 'undefined') {
			const width = window.innerWidth || document.documentElement.clientWidth || 0;
			if (width >= 1024) {
				router.replace('/desktop');
				return;
			}
		}
		setHydrated(true);
	}, [router]);

	useEffect(() => {
		writeStorage('cwv3-lang1', langSel);
	}, [langSel]);

	useEffect(() => {
		writeStorage('cwv3-state1', stateSel);
		setFeedConfig((prev) => {
			if (prev.type === 'feed') {
				return {
					term: `feed/${stateSel}`,
					type: 'feed',
					region: stateSel,
					stats: true
				};
			}
			return {
				...prev,
				region: stateSel,
				stats: false
			};
		});
	}, [stateSel]);

	if (!hydrated) return null;

	return (
		<div className="FeedPage">
			<TitleSearchBar
				setNavHide={setNavHide}
				search
				title="CovidWire"
				setFeedConfig={setFeedConfig}
				feedConfig={feedConfig}
			/>
			<LangSetting defaultLang={langSel} changeLang={setLangSel}/>
			<RegionSetting defaultState={stateSel} changeState={setStateSel}/>
			<SearchFeed langSel={langSel} pageSize={1} feedConfig={feedConfig}/>
			{!navHide && <Navbar/>}
		</div>
	);
}
