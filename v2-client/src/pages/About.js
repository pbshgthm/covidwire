import React from 'react';
import AppTitleBar from '../components/AppTitleBar';


const About = () => {
    return (
       <div>
          <AppTitleBar navSel="about"/>
		  <div className="PageHeading">About Us</div>
		  <div className="aboutTitle">This is a quick stop for short and shareable authentic information about COVID19, accessible in multiple regional languages.</div>
		  <div className="aboutText">
			  CovidWire is a Volunteer powered initiative by a group of students from IIT Bombay, IIIT-H, Delhi University and other Indian Universities.
			  <br/><br/>
			  Misinformation has been a troubling phenomena for some time now, worsening with unreliable, indiscriminate forwards over WhatsApp. It's hard to find authentic news without scouring through lengthy news articles, which many don't have the inclination for, and sometimes are not available in native languages. With a pandemic like COVID19, it is both important to stay informed and avoid being misinformed or spreading misinformation. Wrong information can have major ramifications, leading to more sick people and more deaths.
			  <br/><br/>
			  <div className="aboutMoto">
				  Information may be our primary weapon in this fight. Let it not be a blunt tool, but a sharp sword.
			  </div>
		  </div>
       </div>
    );
}

export default About;
