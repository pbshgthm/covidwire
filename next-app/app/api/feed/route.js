import {NextResponse} from 'next/server';
import path from 'path';
import {promises as fs} from 'fs';

const dataCache = new Map();

const SEARCH_PAGE_SIZE = 2;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loadJson = async (fileName) => {
	if (dataCache.has(fileName)) {
		return dataCache.get(fileName);
	}
	const filePath = path.join(process.cwd(), 'public', 'data', fileName);
	const raw = await fs.readFile(filePath, 'utf8');
	const parsed = JSON.parse(raw);
	dataCache.set(fileName, parsed);
	return parsed;
};

const sortDatesDesc = (collection = {}) => Object.keys(collection)
	.sort((a, b) => {
		if (a > b) return -1;
		if (a < b) return 1;
		return 0;
	});

const sliceCollection = (collection = {}, pageSize, page) => {
	const dates = sortDatesDesc(collection);
	const start = page * pageSize;
	const end = start + pageSize;
	const selected = dates.slice(start, end);
	const result = selected.reduce((acc, date) => {
		acc[date] = collection[date];
		return acc;
	}, {});
	return {result, totalDates: dates.length, end};
};

const orderFeed = (rawFeed = {}) => {
	const orderedFeed = [];

	const regOrder = (reg) => {
		const regionOrder = {
			'Global': 2,
			'National': 1
		};
		if (reg in regionOrder) return regionOrder[reg];
		return 0;
	};

	for (const date in rawFeed) {
		const dayNews = Object.entries(rawFeed[date]);
		dayNews.sort((a, b) => regOrder(a[1].region) - regOrder(b[1].region));
		orderedFeed.push([date, dayNews]);
	}

	orderedFeed.sort((a, b) => {
		if (a[0] > b[0]) return -1;
		if (a[0] < b[0]) return 1;
		return 0;
	});
	return orderedFeed;
};

const getCollection = async (term, type) => {
	if (term === 'hope') {
		return loadJson('hope.json');
	}

	if (type === 'section') {
		const sectionData = await loadJson('section.json');
		const sectionKey = term.replace('section/', '');
		return sectionData[sectionKey] || {};
	}

	const feedData = await loadJson('feed.json');
	const state = term.replace('feed/', '');
	return feedData[state] || {};
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
	try {
		await delay(500);
		const body = await request.json();
		const term = body.term || '';
		const type = body.type || 'feed';
		const pageSize = Number(body.pageSize || SEARCH_PAGE_SIZE);
		const page = Number(body.page || 0);

		const collection = await getCollection(term, type);
		const {result, totalDates, end} = sliceCollection(collection, pageSize, page);
		const ordered = orderFeed(result);

		return NextResponse.json({
			status: true,
			result: ordered,
			next: totalDates > end
		});
	} catch (error) {
		console.error('Feed API error', error);
		return NextResponse.json({
			status: false,
			result: [],
			next: false
		}, {status: 500});
	}
}
