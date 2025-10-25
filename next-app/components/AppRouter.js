'use client';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Import all views
import Home from '@/views/Home';
import Hope from '@/views/Hope';
import SectionsList from '@/views/SectionsList';
import SectionPage from '@/views/SectionPage';
import BlogList from '@/views/BlogList';
import BlogPost from '@/views/BlogPost';
import About from '@/views/About';
import Saved from '@/views/Saved';
import Desktop from '@/views/Desktop';

function DesktopRedirect() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const width = window.innerWidth || document.documentElement.clientWidth || 0;
		const isDesktop = width >= 1024;
		const isOnDesktopRoute = location.pathname === '/desktop';

		if (isDesktop && !isOnDesktopRoute) {
			navigate('/desktop', { replace: true });
		} else if (!isDesktop && isOnDesktopRoute) {
			navigate('/home', { replace: true });
		}
	}, [location.pathname, navigate]);

	return null;
}

export default function AppRouter() {
	return (
		<Router>
			<DesktopRedirect />
			<Routes>
				<Route path="/" element={<Navigate to="/home" replace />} />
				<Route path="/home" element={<Home />} />
				<Route path="/hope" element={<Hope />} />
				<Route path="/sections" element={<SectionsList />} />
				<Route path="/sections/:section" element={<SectionPage />} />
				<Route path="/blog" element={<BlogList />} />
				<Route path="/blog/:blogid" element={<BlogPost />} />
				<Route path="/about" element={<About />} />
				<Route path="/saved" element={<Saved />} />
				<Route path="/desktop" element={<Desktop />} />
			</Routes>
		</Router>
	);
}
