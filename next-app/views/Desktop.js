'use client';

import {getSiteOrigin} from '@/lib/siteConfig';

export default function DesktopPage() {
	const siteOrigin = getSiteOrigin();
	return (
		<div className="DesktopPage">
			<div className="DesktopTitle">CovidWire</div>
			<div className="DesktopDesc">
				A volunteer-driven platform bringing you wide-ranging news snippets on COVID-19 from prominent media of India and the world in multiple languages
			</div>
			<div className="DesktopNotif">
				CovidWire is designed for a mobile experience. Please check the webapp on a mobile device. <br/>Or explore the live mobile simulator on the right.
			</div>
			<div className="MobileHolder">
				<iframe src={siteOrigin} className="Mobileiframe" title="CovidWire Mobile Preview"></iframe>
				<img className="Desktopiphone" src="/assets/iphone.png" alt="Phone frame"/>
				<img className="DesktopiphoneBottom" src="/assets/iphone-bottom.png" alt="Phone frame bottom"/>
			</div>
		</div>
	);
}
