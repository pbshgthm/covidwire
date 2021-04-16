import React,{useState, useEffect, useRef} from 'react';
import classNames from 'classnames';

import TitleBar from '../components/TitleBar.js';
import Navbar from '../components/Navbar.js';

import {scrollToTop} from '../components/utils.js';

function About(){

	const isInitialMount = useRef(true);

	const [showMore,setShowMore]=useState(false)


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
				Hello!
				We are CovidWire, a volunteer-driven platform bringing you wide-ranging news snippets on Covid-19 pandemic from prominent media of India and the world in multiple languages. It runs on the volunteer efforts of 100+ individuals – students, doctors, lawyers, engineers, researcher analysts, homemakers, designers, etc working in their free time.
			</div>
			<div className={classNames("AboutCollapsed",{"AboutCollapsedSel":showMore})}>
				<div className="AboutSubhead">Why CovidWire</div>
				<div className="AboutTextMore">
					With human societies going through profound transformation, this is a unique moment in global history, one that will possibly be remembered as pre and post-covid times. In such a scenario, data and information becomes extremely powerful. There are lots of media platforms that cover the pandemic already, but in spite of all these in place, we felt that data and information remain in complex and inaccessible formats for a large section of the Indian public, creating a gap between those who can access and consume this information and those who cannot.The driving force behind CovidWire is to bridge India’s information gap and fight the misinformation epidemic on social media platforms surrounding COVID-19.
				</div>
				<div className="AboutSubhead">What We Do</div>
				<div className="AboutTextMore">
					At CovidWire, news gathered from 85+ global, national and local media platforms are curated into various domains like Society, Politics, Administration, Sports, Environment, Legal, etc. A pandemic is more than just the virus; we ensure our curation captures the impact of Covid-19 holistically, with a special focus on positive and hopeful news amid world-wide gloom. We believe there are pockets of hope - in individual stories of survival or in institutional/national stories of fighting back without losing a single life. It is important these are highlighted.<br/>
					Once curated, each news article is then digested into short, easy-to-read and shareable snippets. This makes it easier for those who do no have the time or inclination to scour through lengthy articles on a daily basis. Each digest is then translated into various languages, making CovidWire inclusive of millions of non-English speaking Indian populations.
				</div>
			</div>
			<div className="AboutShowMore" onClick={()=>setShowMore(!showMore)}>{showMore?"Hide":"Read more"}</div>
			<div className="AboutSayHi">Say Hi!</div>
			<div className="AboutEmail">hello@covidwire.in</div>
			<div className="AboutContactPane">

				<a href="https://covidwire.in/s/instagram" target="_blank" rel="noopener noreferrer">
					<img className="AboutSocialIcons" src={require('../assets/instagram.png')} alt="CovidWire Instagram"/>
				</a>
				<a href="https://covidwire.in/s/twitter" target="_blank" rel="noopener noreferrer">
					<img className="AboutSocialIcons" src={require('../assets/twitter.png')} alt="CovidWire Twitter"/>
				</a>
				<a href="https://covidwire.in/s/facebook" target="_blank" rel="noopener noreferrer">
					<img className="AboutSocialIcons" src={require('../assets/facebook.png')} alt="CovidWire Facebook"/>
				</a>
				<a href="https://wa.me/917400401323" target="_blank" rel="noopener noreferrer">
					<img className="AboutSocialIcons" src={require('../assets/whatsapp.png')} alt="CovidWire Whatsapp"/>
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
					Abhijith Krishna<br/>
					Bhadri Narayanan
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Design</div>
				<div className="AboutTeamMembers">
					Karunya Baskar<br/>
					Anubhav Nagpal<br/>
					Ishani Kulkarni<br/>
					Prakhar Raj Shakya<br/>
					Rashi Gupta<br/>
					Saumya Oberoi<br/>
					Divya Padmanabhan<br/>
					Nishita Nirmal
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Social Media</div>
				<div className="AboutTeamMembers">
					Priyodarshani Debsharma<br/>
					Gayatri Purigilla<br/>
					Nishant Sachdeva<br/>
					Shantanu Agrawal<br/>
					Sohaib<br/>
					Sahithi Maley
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Global</div>
				<div className="AboutTeamMembers">
					Gaurav Bindra<br/>
					Monil Gokani<br/>
					Tejaswini Yaleswarapu<br/>
					Sandhya<br/>
					Yaseen<br/>
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content India</div>
				<div className="AboutTeamMembers">
					Deeba Altaf<br/>
					Saumya Prabodh Srivastava<br/>
					Abdul Muqeeth<br/>
					Giridhari Lal Gupta<br/>
					Lalitha Majeti<br/>
					Sejal Mutha
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Andhra</div>
				<div className="AboutTeamMembers">
					V Vamsi Viraj<br/>
					Eswar<br/>
					Manasa Kirthana<br/>
					Sai Charan Nivarthi<br/>
					Sanjay Srinivaas<br/>
					Sravya Pusapati<br/>
					Chaitanya

				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Delhi</div>
				<div className="AboutTeamMembers">
					Simran Kapoor<br/>
					Aishwary Khobragade<br/>
					Aniruddh Iyengar<br/>
					Annesha Mazumder<br/>
					Deepika Gulati<br/>
					Gajendra Koli<br/>
					Pratibha Kumari
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Kerala</div>
				<div className="AboutTeamMembers">
					Abhijith KS<br/>
					Anagha Aneesh<br/>
					Archita Sathish<br/>
					Arjun Abhilash<br/>
					Bhadra Suresh<br/>
					Ishaan Nejeeb<br/>
					Maria Rose Johnson<br/>
					Ragini Kanani<br/>
					Rohith T
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Maharashtra</div>
				<div className="AboutTeamMembers">
					Janhavi Borkar<br/>
					Rohan Jhunja<br/>
					Devashree Juvekar<br/>
					Muneeb Mohiuddin<br/>
					Prajakta Dharmadhikari<br/>
					Anish Yande<br/>
					Nandini Bhosale<br/>
					Krishna Dharmadhikari<br/>
				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Tamil Nadu</div>
				<div className="AboutTeamMembers">
					Shilpha Narasimhan<br/>
					Swetha Muthu<br/>
					Adithya A P<br/>
					Divya Manoj K<br/>
					Jayanaveenaa P<br/>
					Ohm Prakash R A<br/>
					Suhailah Javid

				</div>
			</div>
			<div className="AboutTeamHolder">
				<div className="AboutTeamName">Content Telangana</div>
				<div className="AboutTeamMembers">
					Sahithi<br/>
					Anoosha<br/>
					Mukesh<br/>
					Pranavi<br/>
					Sangeeth
				</div>
			</div>
			<div className="BottomSpace"></div>
		</React.Fragment>
	)
}

export default About;
