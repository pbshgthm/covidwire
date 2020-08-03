import React,{useState, useEffect, useRef} from 'react';
import classNames from 'classnames';

import TitleBar from '../components/TitleBar.js';
import Navbar from '../components/Navbar.js';

import {scrollToTop} from '../components/utils.js';

function About(){

	const isInitialMount = useRef(true);

	const [showBody1,setShowBody1]=useState(false)
	const [showBody2,setShowBody2]=useState(false)
	const [showBody3,setShowBody3]=useState(false)

	useEffect(()=>{
		if (isInitialMount.current) {
     		isInitialMount.current = false;
			scrollToTop(false);
  		}
	},[])

	return(
		<React.Fragment>
			<Navbar/>
			<TitleBar title="About"/>
			<div className="AboutText">
				Hello! We are CovidWire. Our platform is built and powered by student volunteers from India to bring together authentic, verified, factful information about Covid-19 pandemic and provide it in an easy to read and share format, in multiple regional languages.
			</div>
			<div className="AboutSectionHead" onClick={()=>setShowBody1(!showBody1)}>
				<img className="AboutShowBtn" src={require("../assets/dropdown.png")} alt=""/> Why CovidWire</div>
			<div className={classNames("AboutSectionBody",{
				"AboutSectionBodyShow":showBody1
			})}>Covid-19 pandemic is causing massive devastation to healthcare systems, employment, economies, and ultimately, lives. These are extraordinary times, where foundations of society as we know them, are going through a profound transformation. Especially in times like these, data and information becomes extremely powerful. It is both important to stay informed and avoid being misinformed or spreading misinformation.
			<br/><br/>
			There are lots of media platforms that cover the pandemic already, but in spite of all these in place, we felt that data and information remain in complex and inaccessible formats for a large section of Indian public, creating a gap between those who can access and consume this information and those who cannot. With CovidWire, we aim to bridge this gap.
			</div>
			<div className="AboutSectionHead" onClick={()=>setShowBody2(!showBody2)}>
				<img className="AboutShowBtn" src={require("../assets/dropdown.png")} alt=""/> What we do</div>
			<div className={classNames("AboutSectionBody",{
				"AboutSectionBodyShow":showBody2
			})}>
			At CovidWire, news gathered from a wide selection of media platforms, ranging from local to global are curated and organised into various domains like Social, Political, Environment, Legal, etc. Pandemic is more than just the virus, hence we ensure that our news curation reflects on the impact of Covid-19 pandemic comprehensively, with a special focus on positive and hopeful news.
			<br/><br/>
			Each news article is then digested into short, easy to read and share snippets. This makes it easier for those who do no have the time or inclination towards scouring through lengthy articles to update themselves.
			<br/><br/>
			Each digest is then translated into various Indian regional languages, making CovidWire inclusive of a large number of non-English speaking Indian population.
			</div>
			<div className="AboutSectionHead" onClick={()=>setShowBody3(!showBody3)}>
				<img className="AboutShowBtn" src={require("../assets/dropdown.png")} alt=""/> Why CovidWire needs you</div>
			<div className={classNames("AboutSectionBody",{
				"AboutSectionBodyShow":showBody3
			})}>
			We are a student volunteer powered platform that fully relies on community for our betterment. The aim is to make this platform fully crowdsourced as we progress.
			</div>
			<div className="AboutSayHi">Say Hi!</div>
			<div className="AboutEmail">hello@covidwire.in</div>
			<div className="AboutContactPane">

				<a href="https://covidwire.in/s/instagram" target="_blank" rel="noopener noreferrer">
					<img className="SupportShareIcons" src={require('../assets/instagram.png')} alt="CovidWire Instagram"/>
				</a>
				<a href="https://covidwire.in/s/twitter" target="_blank" rel="noopener noreferrer">
					<img className="SupportShareIcons" src={require('../assets/twitter.png')} alt="CovidWire Twitter"/>
				</a>
				<a href="https://covidwire.in/s/facebook" target="_blank" rel="noopener noreferrer">
					<img className="SupportShareIcons" src={require('../assets/facebook.png')} alt="CovidWire Facebook"/>
				</a>
				<a href="https://covidwire.in/s/linkedin" target="_blank" rel="noopener noreferrer">
					<img className="SupportShareIcons" src={require('../assets/linkedin.png')} alt="CovidWire LinkedIn"/>
				</a>
				<a href="https://wa.me/917400401323" target="_blank" rel="noopener noreferrer">
					<img className="SupportShareIcons" src={require('../assets/whatsapp-1.png')} alt="CovidWire Whatsapp"/>
				</a>
				<a href="https://wa.me/918985844755" target="_blank" rel="noopener noreferrer">
					<img className="SupportShareIcons" src={require('../assets/whatsapp-2.png')} alt="CovidWire Whatsapp"/>
				</a>
			</div>
			<div className="AboutSubHead">Our Team</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Core Team</div>
				<div className="AboutTeamMembers">
					Poobesh Gowtham<br/>
					Sarigama Yerra
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Product</div>
				<div className="AboutTeamMembers">
					Abhijith Krishna
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Design</div>
				<div className="AboutTeamMembers">
					Aniruddh Ravipati<br/>
					Karunya Baskar<br/>
					Prakhar Raj
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Global</div>
				<div className="AboutTeamMembers">
					Roopal Dahiya<br/>
					Gaurav Bindra<br/>
					Himakar YV<br/>
					Keerthanashree Anbarasan<br/>
					Monil Gokani<br/>
					Tejaswini Yeleswarapu<br/>
					Vanalata Bulusu
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content India</div>
				<div className="AboutTeamMembers">
					Saumya Prabodh Srivastava<br/>
					Deeba Altaf<br/>
					Giridhari Lal<br/>
					Priyodarshani Debsharma<br/>
					Sri Pravallika S<br/>
					Suhailah Javid
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Andhra</div>
				<div className="AboutTeamMembers">
					Abdul Muqeeth<br/>
					BVN Charan<br/>
					Chaitanya Muvva<br/>
					Lalitha<br/>
					Sangeeth Reddy<br/>
					Sanjay Srinivaas<br/>
					Sripada Atreya<br/>
					Vamsi Ram Mohan
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Delhi</div>
				<div className="AboutTeamMembers">
					Simran Kapoor<br/>
					Adithya AP<br/>
					Aishwary Khobragade <br/>
					Annesha Mazumder<br/>
					Deepika Gulati<br/>
					Divya Manoj<br/>
					Maria Rose Johnson<br/>
					Mohammad Moizuddin<br/>
					Pratibha Kumari<br/>
					Shantanu Agrawal<br/>
					Swetha Muthu
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Maharashtra</div>
				<div className="AboutTeamMembers">
					Rohan Jhunja<br/>
					Anish Yande<br/>
					Krishna Dharmadhikari<br/>
					Muneeb Mohiuddin<br/>
					Nandini B<br/>
					Prajakta Dharmadhikari<br/>
					Shilpha Narasimhan<br/>
					Janhavi Borkar
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Social Media</div>
				<div className="AboutTeamMembers">
					Priyodarshani Debsharma<br/>
					Himakar YV<br/>
					Gayathri Purigilla
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Team Flow</div>
				<div className="AboutTeamMembers">
					Shubhangi Gautham<br/>
					Saina Karla
				</div>
			</div>
			<div className="AboutPartnersPane">
				<div className="AboutPartnersHead">Our Friends</div>
				<a href="https://factly.in/" target="_blank" rel="noopener noreferrer">
					<img className="AboutPartnerLogo" src={require("../assets/factly.png")} alt="Factly"/>
				</a>

				<a href="https://getlokalapp.com/" target="_blank" rel="noopener noreferrer">
					<img className="AboutPartnerLogo" src={require("../assets/lokal.png")} alt="Factly"/>
				</a>

				<a href="https://www.agrahyah.com/" target="_blank" rel="noopener noreferrer">
					<img className="AboutPartnerLogo" src={require("../assets/agrahyah.png")} alt="Factly"/>
				</a>

				<a href="http://thesocialcorporate.com/" target="_blank" rel="noopener noreferrer">
					<img className="AboutPartnerLogo" src={require("../assets/tsc.png")} alt="Factly"/>
				</a>
			</div>
		</React.Fragment>
	)
}

export default About;
