import React from 'react'


function Desktop(){

	return(<div className="DesktopPage">
		<div className="DesktopTitle">CovidWire</div>
		<div className="DesktopDesc">A volunteer-driven platform bringing you wide-ranging news snippets on COVID-19 from prominent media of India and the world in multiple languages</div>
		<div className="DesktopNotif">CovidWire is designed for a mobile experience. Please check the webapp on a mobile device. <br/>To try our moblie simulator, check on the right</div>
		<div className="MobileHolder">
			<iframe src="https://covidwire.in" className="Mobileiframe"></iframe>
			<img className="Desktopiphone" src={require("../assets/iphone.png")}/>
			<img className="DesktopiphoneBottom" src={require("../assets/iphone-bottom.png")}/>
		</div>
	</div>)
}
export default Desktop;
