const rawOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

const envOrigin = rawOrigin.replace(/\/$/, '');

export const SITE_ORIGIN = envOrigin;

export const getSiteOrigin = () => {
	if (typeof window !== 'undefined' && window.location?.origin) {
		return window.location.origin.replace(/\/$/, '');
	}
	return SITE_ORIGIN;
};
