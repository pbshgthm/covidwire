'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function IndexPage() {
	const router = useRouter();

	useEffect(() => {
		const width = window.innerWidth || document.documentElement.clientWidth || 0;
		if (width >= 1024) {
			router.replace('/desktop');
		} else {
			router.replace('/home');
		}
	}, [router]);

	return null;
}
