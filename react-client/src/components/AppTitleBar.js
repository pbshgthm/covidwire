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
				<SidePane navSel={this.props.navSel} showPane={this.state.showPane} togglePane={this.togglePane}/>
				<div className="AppTitleBar">
					<img className="AppMenuBtn" onClick={this.togglePane} src={require("../assets/menu.png")}  alt="Show Menu"/>
					<a href="/" className="AppTitle">CovidWire
						<img alt="CovidWire Logo" src={require("../assets/logo.png")} className="AppLogo"/>
					</a>
					<div className="DesktopNavBar">
						<div className="DesktopNavLinks"><a href="/">Home</a></div>
						<div className="DesktopNavLinks"><a href="/about">About Us</a></div>
						<div className="DesktopNavLinks"><a href="/team">Our Team</a></div>
						<div className="DesktopNavLinks"><a href="https://covidwire.in/s/join" target="_blank" rel="noopener noreferrer">Join Us</a></div>
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
				<img className="SidepaneBack" alt="Hide Side Pane" src={require("../assets/back.png")} onClick={props.togglePane}/>
				<div className="SidePaneName">CovidWire
					<img alt="CovidWire Logo" src={require("../assets/logo.png")} className="SidePaneLogo"/>
				</div>
				<div className="SidePaneNav">

					<div className={classNames("SidePaneLinks",{"SidePaneLinks-sel":props.navSel==='home'})}>
						<a href="/">
							<img className="NavIcons" alt="Nav Home" src={require('../assets/nav-home.png')}/>
							Home
						</a>
					</div>
					<div className={classNames("SidePaneLinks",{"SidePaneLinks-sel":props.navSel==='about'})}>
						<a href="/about">
							<img className="NavIcons" alt="Nav About" src={require('../assets/nav-about.png')}/>
							About Us
						</a>
					</div>
					<div className={classNames("SidePaneLinks",{"SidePaneLinks-sel":props.navSel==='team'})}>
						<a href="/team">
							<img className="NavIcons" alt="Nav Team" src={require('../assets/nav-team.png')}/>
							Our Team
						</a>
					</div>
					<div className={classNames("SidePaneLinks",{"SidePaneLinks-sel":props.navSel==='join'})}>
						<a href="https://covidwire.in/s/join" target="_blank" rel="noopener noreferrer">
							<img className="NavIcons" alt="Nav Join" src={require('../assets/nav-join.png')}/>
							Join Us
						</a>
					</div>

				</div>
				<div className="SidePaneHi">
					<div className="SidePaneHiText">Say Hi!</div>
					<div className="SidePaneContact">
						<img className="SidePaneContactIcon" src={require("../assets/mail.png")} alt="Email"/>
						<a href="mailto:hello@covidwire.in" target="_blank" rel="noopener noreferrer">
							hello@covidwire.in
						</a>
					</div>
					<div className="SidePaneContact-ph">
						<img className="SidePaneContactIcon" src={require("../assets/phone.png")} alt="Phone"/>
						<a href="tel:+91 7400401323" target="_blank" rel="noopener noreferrer" >7400401323</a> |
						<a href="tel:+91 6305660413" target="_blank" rel="noopener noreferrer" > 6305660413</a>
					</div>
					<div className="SidePaneContact">
						<img className="SidePaneContactIcon" src={require("../assets/instagram.png")} alt="Instagram"/>
						<a href="https://instagram.com/covid.wire" target="_blank" rel="noopener noreferrer">
							covid.wire
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}


export default AppTitleBar;
