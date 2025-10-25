const normalizeOrigin = (value) => {
	if (!value) return null;
	const trimmed = value.trim();
	if (trimmed === '') return null;
	if (/^https?:\/\//i.test(trimmed)) {
		return trimmed.replace(/\/$/, '');
	}
	return `https://${trimmed.replace(/\/$/, '')}`;
};

const rawOrigin =
	normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
	'http://localhost:3000';

const envOrigin = rawOrigin.replace(/\/$/, '');

export const SITE_ORIGIN = envOrigin;

export const getSiteOrigin = () => {
	if (typeof window !== 'undefined' && window.location?.origin) {
		return window.location.origin.replace(/\/$/, '');
	}
	return SITE_ORIGIN;
};
