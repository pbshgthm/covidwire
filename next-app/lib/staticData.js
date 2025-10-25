'use client';

const cache = new Map();

const withPublicUrl = (path) => {
	if (path.startsWith('/')) {
		return path;
	}
	return `/${path}`;
};

export const loadStaticJson = (path) => {
	const url = withPublicUrl(path);
	if (!cache.has(url)) {
		cache.set(
			url,
			fetch(url).then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to load static data from ${url}`);
				}
				return response.json();
			})
		);
	}
	return cache.get(url);
};

export const resetStaticCache = () => {
	cache.clear();
};
