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
					<div className="SidePaneLinks"><a href="/about">About Us</a></div>
					<div className="SidePaneLinks  SidePaneLinks-sel"><a href="/team">Our Team</a></div>
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
const Team = () => {
    return (
       <div>
          <AppTitleBar/>
		  <div className="PageHeading">Our Team</div>


		<div className="TeamName">Core Team</div>
		<div className="TeamHolder">
  			  <div className="TeamMembers">Poobesh Gowtham</div>
  			  <div className="TeamMembers">Sarigama Yerra</div>
  		</div>


		<div className="TeamName">Design Team</div>
		<div className="TeamHolder">
  			  <div className="TeamMembers">Abhijith Krishna</div>
  			  <div className="TeamMembers">Karunya Baskar</div>
			   <div className="TeamMembers">Prakhar Raj</div>
  		</div>

		<div className="TeamName">Core Content Team</div>
		<div className="TeamHolder">
			  <div className="TeamMembers">Abdul Muqeeth</div>
			  <div className="TeamMembers">Abrar Ahmed</div>
			  <div className="TeamMembers">Rohan Jhunja </div>
			  <div className="TeamMembers">Vanalata Bulusu</div>
			  <div className="TeamMembers">Gaurav Bindra</div>
			  <div className="TeamMembers">Roopal Dahiya</div>
			  <div className="TeamMembers">Saumya Shrivastava</div>
			  <div className="TeamMembers">Shilpha Narasimhan</div>
		</div>

		<div className="TeamName">Content Team</div>
		<div className="TeamHolder">

		  <div className="TeamMembers">Anish Yande</div>
		  <div className="TeamMembers">Annesha Mazumder</div>
		  <div className="TeamMembers">Deeba Altaf</div>
		  <div className="TeamMembers">Deepika Gulati</div>
		  <div className="TeamMembers">Giridhari Lal</div>
		  <div className="TeamMembers">Gokula Krishnan</div>
		  <div className="TeamMembers">Harish Kumar</div>
		  <div className="TeamMembers">Himakar Yv</div>
		  <div className="TeamMembers">Janhavi Borkar</div>
		  <div className="TeamMembers">Jayanaveenaa</div>
		  <div className="TeamMembers">Keerthanashree</div>
		  <div className="TeamMembers">Malathi Lata</div>
		  <div className="TeamMembers">Prajakta</div>
		  <div className="TeamMembers">Satya Challa</div>
		  <div className="TeamMembers">Pratibha</div>
		  <div className="TeamMembers">Priyodarshini</div>
		  <div className="TeamMembers">Reema Govil</div>
		  <div className="TeamMembers">Salma Faizan</div>
		  <div className="TeamMembers">Salma Shaik</div>
		  <div className="TeamMembers">Sangeeth</div>
		  <div className="TeamMembers">Satyam Saran</div>
		  <div className="TeamMembers">Simran Kapoor</div>
		  <div className="TeamMembers">Sravya Gurram</div>
		  <div className="TeamMembers">Suhailah</div>
		  <div className="TeamMembers">Swapnil Pakhare</div>
		  <div className="TeamMembers">Swetha Muthu</div>

	  </div>
	  <br/><br/><br/><br/><br/>



       </div>
    );
}

export default Team;
