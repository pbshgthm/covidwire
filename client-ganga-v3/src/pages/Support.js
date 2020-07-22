import React from 'react';

import {scrollToTop} from '../components/utils.js';

function Support(){
	scrollToTop()
	return(
		<React.Fragment>
			<div className="PageTitle">Support Us</div>
			<div className="TopSpace"></div>
			<div className="SupportSection">
				<img className= "SupportSectionImg" src={require('../assets/team.png')} alt="Join our Team"/>
				<div className="SupportSectionName">Join our Team</div>
				<div className="SupportSectionDesc">
					CovidWire is a community driven initiative build and powered by student volunteers. If the idea of CW excites you, do join us, we would love to have you onboard!
				</div>
				<a href="https://covidwire.in/s/joincovidwire" target="_blank" rel="noopener noreferrer">
					<div className="SupportButton">Apply</div>
				</a>
			</div>
			<div className="SupportSection">
				<img className="SupportSectionBg1" src={require('../assets/support-bg1.png')} alt="" />
				<div className="SupportSectionName">Fund Us</div>
				<img className="SupportSectionImg SupportSectionImgFund" src={require('../assets/fund.png')} alt="Fund Us"/>
				<div className="SupportSectionDesc">
					Occupied in life, but still want to contribute? you can help us by extending monetary support to keep the platform running. Every bit of help is hugely welcome
				</div>
				<a href="https://covidwire.in/s/fundcovidwire" target="_blank" rel="noopener noreferrer">
					<div className="SupportButton SupportButtonRight">Support</div>
				</a>
			</div>
			<div className="SupportSection">
				<img className="SupportSectionImg SupportSectionImgShare" src={require('../assets/share.png')} alt="Spread the Word"/>
				<div className="SupportSectionName SupportSectionNameShare">Spread the Word</div>
				<div className="SupportSectionDesc">
					CovidWire's aim is to reach out and keep people informed. Share CovidWire with your friends and family and help us reach the right audience.
				</div>
				<div className="SupportSharePanel">
					<a href="https://covidwire.in/s/instagram" target="_blank" rel="noopener noreferrer">
						<img className="SupportShareIcons" src={require('../assets/instagram.png')} alt="Share on Instagram"/>
					</a>
					<a href="https://covidwire.in/s/twitter" target="_blank" rel="noopener noreferrer">
						<img className="SupportShareIcons" src={require('../assets/twitter.png')} alt="Share on Twitter"/>
					</a>

					<a href="https://covidwire.in/s/facebook" target="_blank" rel="noopener noreferrer">
						<img className="SupportShareIcons" src={require('../assets/facebook.png')} alt="Share on Facebook"/>
					</a>

					<a href="https://covidwire.in/s/linkedin" target="_blank" rel="noopener noreferrer">
						<img className="SupportShareIcons" src={require('../assets/linkedin.png')} alt="Share on LinkedIn"/>
					</a>
					<a href="whatsapp://send?text=Have you checked out CovidWire? This is a platform built and powered by student volunteers from across India. It brings together authentic, verified and factful information about Covid-19 pandemic and provides it in an easy to read and share format, in multiple regional languages. %0A%0A_This is a community driven platform, so you can be a part of it too!_%0A%0AVisit and checkout this project at https://covidwire.in.">
						<img className="SupportShareIcons" src={require('../assets/whatsapp.png')} alt="Share on Whatsapp"/>
					</a>
				</div>
			</div>
			<div className="SupportSection">
				<img className="SupportSectionBg2" src={require('../assets/support-bg2.png')} alt="" />
				<div className="SupportSectionName">Talk to Us</div>
				<img className="SupportSectionImg SupportSectionImgFeedback" src={require('../assets/feedback.png')} alt="Join our Team"/>
				<div className="SupportSectionDesc">
					CovidWire is shaped by our users. We'd love to listen to any feedbacks and suggestions. Do write to us!
				</div>
				<a href="https://covidwire.in/s/feedback" target="_blank" rel="noopener noreferrer">
					<div className="SupportButton">Apply</div>
				</a>
			</div>
			<div className="BottomSpace"></div>

		</React.Fragment>
	)
}

export default Support;
