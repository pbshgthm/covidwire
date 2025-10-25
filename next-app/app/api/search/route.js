import {NextResponse} from 'next/server';
import path from 'path';
import {promises as fs} from 'fs';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SEARCH_PAGE_SIZE = 15;
let indexCache = null;

const loadIndex = async () => {
	if (indexCache) {
		return indexCache;
	}
	const filePath = path.join(process.cwd(), 'public', 'data', 'index.json');
	const fileContent = await fs.readFile(filePath, 'utf8');
	indexCache = JSON.parse(fileContent);
	return indexCache;
};

const normaliseKeywords = (term) => term
	.split(' ')
	.map((word) => word.trim().toLowerCase())
	.filter((word) => word.length > 0);

const resolveRegions = (region) => {
	const base = ['Global', 'National'];
	if (region && region !== 'India & World') {
		base.push(region);
	}
	return base;
};

export async function POST(request) {
	try {
		await delay(1000);
		const payload = await request.json();
		const term = payload.term || '';
		const page = Number(payload.page || 0);
		const region = payload.region || '';

		const keywords = normaliseKeywords(term);
		const allowedRegions = resolveRegions(region);
		const indexData = await loadIndex();

		const records = Object.values(indexData || {});

		const matches = records.filter((record) => {
			if (!allowedRegions.includes(record.region)) {
				return false;
			}
			if (keywords.length === 0) {
				return true;
			}
			const headline = (record.digests?.English?.headline || '').toLowerCase();
			const digest = (record.digests?.English?.digest || '').toLowerCase();
			return keywords.some((keyword) => headline.includes(keyword) || digest.includes(keyword));
		});

		matches.sort((a, b) => {
			if (a.time > b.time) return -1;
			if (a.time < b.time) return 1;
			return 0;
		});

		const start = page * SEARCH_PAGE_SIZE;
		const end = start + SEARCH_PAGE_SIZE;
		const pageItems = matches.slice(start, end);

		const grouped = pageItems.reduce((acc, record) => {
			const date = record.time.split('T')[0];
			if (!acc[date]) acc[date] = {};
			acc[date][record.hash] = record;
			return acc;
		}, {});

		return NextResponse.json({
			status: true,
			result: grouped,
			next: matches.length > end
		});
	} catch (error) {
		console.error('Search API error', error);
		return NextResponse.json({
			status: false,
			result: {},
			next: false
		}, {status: 500});
	}
}
