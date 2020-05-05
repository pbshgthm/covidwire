import React from 'react';
import classNames from 'classnames';

class AppTitleBar extends React.Component {
	constructor(props){
		super(props)
		this.state={
			showPane:false

		}
		this.togglePane=this.togglePane.bind(this)
	}
	togglePane(){
		if(this.state.showPane){
			document.body.style.overflow = "scroll";
			this.setState({showPane:false})
		}else{
			document.body.style.overflow = "hidden";
			this.setState({showPane:true})
		}
	}

	render() {
		return (
			<div>
				<SidePane showPane={this.state.showPane} togglePane={this.togglePane}/>
				<div className="AppTitleBar">
					<img className="AppMenuBtn" onClick={this.togglePane} src={require("./../assets/menu.png")}  alt="Show Menu"/>
					<a href="/" className="AppTitle">CovidWire
						<img alt="CovidWire Logo" src={require("./../assets/logo.png")} className="AppLogo"/>
					</a>
					<div className="DesktopNavBar">
						<div className="DesktopNavLinks"><a href="/">Home</a></div>
						<div className="DesktopNavLinks"><a href="/about">About Us</a></div>
						<div className="DesktopNavLinks"><a href="/team">Our Team</a></div>
						<div className="DesktopNavLinks"><a href="https://covidwire.in/s/joinus" target="_blank" rel="noopener noreferrer">Join Us</a></div>
					</div>
				</div>
			</div>)
	}
}

function SidePane(props){
	return(
		<div>
			<div className={classNames('BgBlock',{"BgBlock-sel":props.showPane})} onClick={props.togglePane}></div>
			<div className={classNames('SidePane',{"SidePane-sel":props.showPane})}>
				<img className="SidepaneBack" alt="Hide Side Pane" src={require("./../assets/back.png")} onClick={props.togglePane}/>
				<div className="SidePaneName">CovidWire
					<img alt="CovidWire Logo" src={require("./../assets/logo-dark.png")} className="SidePaneLogo"/>
				</div>
				<div className="SidePaneNav">
					<div className="SidePaneLinks"><a href="/">Home</a></div>
					<div className="SidePaneLinks   SidePaneLinks-sel"><a href="/about">About Us</a></div>
					<div className="SidePaneLinks"><a href="/team">Our Team</a></div>
					<div className="SidePaneLinks"><a href="https://covidwire.in/s/joinus" target="_blank" rel="noopener noreferrer">Join Us</a></div>
				</div>
				<div className="SidePaneHi">
					<div className="SidePaneHiText">Say Hi!</div>
					<div className="SidePaneContact">
						<img className="SidePaneContactIcon" src={require("./../assets/mail.png")} alt="Email"/>
						<a href="mailto:hello@covidwire.in" target="_blank" rel="noopener noreferrer">
							hello@covidwire.in
						</a>
					</div>
					<div className="SidePaneContact-ph">
						<img className="SidePaneContactIcon" src={require("./../assets/phone.png")} alt="Phone"/>
						<a href="tel:+91 7400401323" target="_blank" rel="noopener noreferrer" >7400401323</a> |
						<a href="tel:+91 6305660413" target="_blank" rel="noopener noreferrer" > 6305660413</a>
					</div>
					<div className="SidePaneContact">
						<img className="SidePaneContactIcon" src={require("./../assets/instagram.png")} alt="Instagram"/>
						<a href="https://instagram.com/covid.wire" target="_blank" rel="noopener noreferrer">
							covid.wire
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
const About = () => {
    return (
       <div>
          <AppTitleBar/>
		  <div className="PageHeading">About Us</div>
		  <div className="aboutTitle">One stop for short and sharable authentic info about Covid19 in multitude of regional languages.</div>
		  <div className="aboutText">
			  The global pandemic that the Corona virus has created, has consistently been in the headlines for a while now. As this global event unfolds, massive amounts of information about Covid-19 is flowing in India, which has huge diversity in terms of culture, language and socioeconomic status. And in their confluence, there are lots of social problems that arise. Foremost among these is the shift in how news is propagated, from traditional to social media. This has made it easier for news to be shared in the various regional languages in India, allowing millions to rely on platforms like whatsapp to be updated on current events. However, this has also led to the rampant spread of misinformation, especially among those that rely solely on whatsapp for their news and have no alternative ways to verify their authenticity.
			  <br/><br/>
			  <div className="aboutDesc">
				  Our app CovidWire, is an attempt to keep India updated with verified content from reliable sources. We will provide updates ranging from regional to international, related to the Coronavirus pandemic, in a variety of languages in an easy read and share format.
			  </div>
			  <br/><br/>
			  <div className="aboutMoto">
				  Combating Corona, one shared true story at a time.
			  </div>
		  </div>
       </div>
    );
}

export default About;
