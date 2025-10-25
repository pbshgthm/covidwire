'use client';

import {useEffect} from 'react';
import {Link} from 'react-router-dom';

import TitleBar from '@/components/TitleBar.js';
import Navbar from '@/components/Navbar.js';
import config from '@/config.js';
import {urlEncode, scrollToTop} from '@/components/utils.js';

const normalizeRegion = (value) => {
	const mapping = {
		'Global': 'World',
		'National': 'India'
	};
	return mapping[value] || value;
};

export default function SectionsPage() {
	useEffect(() => {
		scrollToTop(false);
	}, []);

	return (
		<div>
			<TitleBar title="Sections"/>
			<div className="SectionHolder">
				<div className="SectionImageHolder">
					<Link to="/sections/featured">
						<div className="SectionCard">
							<img className="SectionImage" src="/assets/sections/featured.png" alt="Featured"/>
							<div className="SectionName">Featured</div>
						</div>
					</Link>
					<Link to="/saved">
						<div className="SectionCard">
							<img className="SectionImage" src="/assets/sections/saved.png" alt="Saved"/>
							<div className="SectionName">Saved</div>
						</div>
					</Link>
				</div>
				<div className="SectionCategory">Domains</div>
				<div className="SectionImageHolder">
					{config.domain.map((domain) => (
						<Link key={`section-${domain}`} to={`/sections/${urlEncode(domain)}`}>
							<div className="SectionCard">
								<img className="SectionImage" src={`/assets/sections/${domain}.jpg`} alt={domain}/>
								<div className="SectionName">{domain}</div>
							</div>
						</Link>
					))}
				</div>
				<div className="SectionCategory">Regions</div>
				<div className="SectionImageHolder">
					{config.region.map((region) => {
						const normalized = normalizeRegion(region);
						return (
							<Link key={`section-${normalized}`} to={`/sections/${urlEncode(normalized)}`}>
								<div className="SectionCard">
									<img className="SectionImage" src={`/assets/sections/${normalized}.jpg`} alt={normalized}/>
									<div className="SectionName">{normalized}</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
			<div className="BottomSpace"></div>
			<Navbar/>
		</div>
	);
}
