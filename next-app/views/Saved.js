'use client';

import {useEffect, useState} from 'react';

import TitleBar from '@/components/TitleBar.js';
import LangSetting from '@/components/LangSetting.js';
import Navbar from '@/components/Navbar.js';
import FeedbackForm from '@/components/FeedbackForm.js';
import {scrollToTop} from '@/components/utils.js';
import {feedFormat, orderFeed} from '@/components/FeedUtils.js';
import {getSaved} from '@/components/utils.js';

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

const readSaved = () => {
	if (typeof window === 'undefined') return [];
	return Object.values(getSaved());
};

export default function SavedPage() {
	const [langSel, setLangSel] = useState(DEFAULT_LANG);
	const [showFeedback, setShowFeedback] = useState(false);
	const [feedbackData, setFeedbackData] = useState({});
	const [feedData, setFeedData] = useState([]);
	const [readReady, setReadReady] = useState(false);

	useEffect(() => {
		setLangSel(readLang());
		scrollToTop(false);
		const savedList = readSaved();
		const dateDict = {};
		savedList.forEach((card) => {
			const date = card.time.split('T')[0];
			if (!dateDict[date]) {
				dateDict[date] = {};
			}
			dateDict[date][card.hash] = card;
		});
		setFeedData(orderFeed(dateDict));
		setReadReady(true);
	}, []);

	useEffect(() => {
		writeLang(langSel);
	}, [langSel]);

	return (
		<>
			<TitleBar title="Saved" showBack backPath="/sections"/>
			<div className="FeedPage">
				<LangSetting defaultLang={langSel} changeLang={setLangSel}/>
				<FeedbackForm cardData={feedbackData} showFeedback={showFeedback} setShowFeedback={setShowFeedback}/>
				<div className="NewsFeed">
					{readReady && feedFormat(feedData, langSel, setFeedbackData)}
				</div>
				{feedData.length === 0 && <img className="NoSave" src="/assets/no-save.png" alt="No save"/>}
				<Navbar/>
			</div>
		</>
	);
}
