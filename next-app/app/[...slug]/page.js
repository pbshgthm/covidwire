'use client';

import dynamic from 'next/dynamic';

// Dynamically import the App component with SSR disabled
const AppRouter = dynamic(() => import('@/components/AppRouter'), {
	ssr: false,
	loading: () => <div style={{width: '100vw', height: '100vh', backgroundColor: '#FAFAFA'}}></div>
});

export default function Page() {
	return <AppRouter />;
}
