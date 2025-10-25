import "./globals.css";
import {SITE_ORIGIN} from '@/lib/siteConfig';

export const metadata = {
	title: "CovidWire - Comprehensive news about Covid-19 pandemic",
	description: "A volunteer-driven platform bringing you wide-ranging news snippets on COVID-19 from prominent media of India and the world in multiple languages",
	openGraph: {
		title: "CovidWire | Comprehensive news about Covid-19 pandemic",
		siteName: "CovidWire",
		url: SITE_ORIGIN,
		description: "A volunteer-driven platform bringing you wide-ranging news snippets on COVID-19 from prominent media of India and the world in multiple languages",
		type: "website",
		images: [
			{
				url: `${SITE_ORIGIN}/logo.png`,
				width: 1200,
				height: 630,
				alt: "CovidWire"
			}
		]
	},
	icons: {
		icon: [
			{url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
			{url: "/favicon-96x96.png", sizes: "96x96", type: "image/png"},
			{url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"}
		],
		apple: [
			{url: "/apple-icon-57x57.png", sizes: "57x57"},
			{url: "/apple-icon-60x60.png", sizes: "60x60"},
			{url: "/apple-icon-72x72.png", sizes: "72x72"},
			{url: "/apple-icon-76x76.png", sizes: "76x76"},
			{url: "/apple-icon-114x114.png", sizes: "114x114"},
			{url: "/apple-icon-120x120.png", sizes: "120x120"},
			{url: "/apple-icon-144x144.png", sizes: "144x144"},
			{url: "/apple-icon-152x152.png", sizes: "152x152"},
			{url: "/apple-icon-180x180.png", sizes: "180x180"}
		],
		android: [
			{url: "/android-icon-192x192.png", sizes: "192x192", type: "image/png"}
		]
	},
	manifest: "/manifest.json"
};

export const viewport = {
	themeColor: "#ffffff"
};

// Disabled for performance - these settings prevent Next.js optimizations
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500&family=Baloo+Chettan+2:wght@400;500&family=Baloo+Tammudu+2:wght@400;500&family=Baloo+Thambi+2:wght@400;500&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Nunito+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap"
					rel="stylesheet"
				/>
				<meta name="msapplication-TileColor" content="#ffffff"/>
				<meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
			</head>
			<body>{children}</body>
		</html>
	);
}
