import React from 'react';
import {stateData,defaultLang} from './stateList'


class AppSetBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stateSet:this.props.stateSet,
			stateView: false,
		}
		this.changeLang = this.changeLang.bind(this);
		this.viewStates = this.viewStates.bind(this);
		this.selState = this.selState.bind(this)
	}
	changeLang(langVal) {
		var stateSet = {...this.state.stateSet}
		stateSet.selLang = langVal;
		this.setState({stateSet},()=>{
				this.props.callbackSet(this.state.stateSet);
		});
	}
	viewStates() {
		if (this.state.stateView) {
			this.setState({'stateView': false})
		} else {
			this.setState({'stateView': true})
		}
	}
	selState(stateVal){
		let stateSet = {...this.state.stateSet}
		stateSet.state = stateVal;
		stateSet.lang=stateData.find(x => x.name === stateVal).lang;
		stateSet.selLang=0;
		this.setState({stateSet,stateView:false},()=>{
				this.props.callbackSet(this.state.stateSet);
		});

	}

	fillLang(x,i){
		return(
			<div  className={(this.state.stateSet.selLang===i)?"LangBtn-sel":"LangBtn"} onClick={() => this.changeLang(i)} key={'lang-'+i}>{x.glyph}</div>
		)
	}

	stateList=(<div className="StateItemList">{stateData.map(x=>(
		<div className="StateItem" onClick={()=>this.selState(x.name)} key={'sl-'+x.name}>{x.name}</div>
	))}</div>)


	render() {
		let langList=(<div>{this.state.stateSet.lang.concat(defaultLang).map((x,i)=>this.fillLang(x,i))}</div>)
		return (
		<div className="AppSetBar">
			<div className="StateName" onClick={this.viewStates}>{this.state.stateSet.state} </div >

			<div className="LangBar" style={{opacity:(this.state.stateView)?0:1}}>
				{langList}
			</div>
			<div className="StateSelPane" style={{
				height: this.state.stateView * 90 + 'vh'}}>
				{this.stateList}
			</div>
		</div>)
}
}

function SidePane(props){
	return(
		<div>
			<div className="bgBlock" style={{left:props.showPane?'0vw':'-100vw',
				'opacity':props.showPane?1:0}}></div>
			<div className="SidePane" style={{left:props.showPane?'0vw':'-75vw'}}>
				<img className="sidepane-back" alt="" src={require("./assets/back.png")} onClick={props.togglePane}/>
			</div>
		</div>
	)
}

class AppTitleBar extends React.Component {
	constructor(props){
		super(props)
		this.state={
			'showPane':false
		}
		this.togglePane=this.togglePane.bind(this)
	}
	togglePane(showPane){
		if(showPane){
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
					<img className="AppMenuBtn" onClick={()=>{this.togglePane()}} src={require("./assets/menu.png")}  alt="Menu"/>
					<div className="AppTitle">CovidWire</div>
				</div>
			</div>)
	}
}

function StateInfoCard() {

	function StateStats(){

		var data=[
			['Confirmed',176,'+16',233,'+23','#DA6666'],
			['Active',165,'+9',233,'+23','#5A84D6'],
			['Recovered',11,'+6',233,'+23','#7CCD97'],
			['Deceased',2,'+0',233,'+23','#979797']
		]

		var stats=data.map(x=>
				<div className="StateStatsItem" key={'stat-'+x[0]}>
					<div className="StatsName">{x[0]}</div>
					<div className="StatsVal" style={{color:x[5]}}>
						<div className="StatsValTot">{x[1]}</div>
						<div className="StatsValInc">{'('+x[2]+')'}</div>
					</div>
					<div className="StatsVal" style={{color:x[5]}}>
						<div className="StatsValTot">{x[3]}</div>
						<div className="StatsValInc">{'('+x[4]+')'}</div>
					</div>
				</div>
			)
		return stats

	}
	return (
		<div className="NewsCard">
			<div className="NewsCard-header">
				<div className="NewsCard-recent">43 MIN</div>
				<div className="NewsCard-time">4:20 pm MAR 7</div>
			</div>
			<div className="NewsCard-hastag-bar">
				<div className="NewsCard-hashtag">#NEW_CASES</div>
				<div className="NewsCard-hashtag">#STATS</div>
			</div>
			<div className="NewsCard-body">
				<div className="StateStatsLabels">
					<div className="StatLabelState">J&K</div>
					<div className="StateLabelCountry">India</div>
				</div>
				<StateStats/>
			</div>
			<div className="NewsCard-footer">
				<div className="NewsCard-source">https://covid19india.org</div>
				<div className="NewsCard-share">
					<img alt="" className="NewsCard-share-icon" src={require('./assets/share.png')}/>
					<a href="whatsapp://send?text=Hieeee" data-action="share/whatsapp/share">
						<img alt="" className="NewsCard-whatsapp-icon" src={require('./assets/whatsapp.png')}/>
					</a>
				</div>
			</div>
		</div>
	)
}

class NewsCard extends React.Component {
	render() {
		return (
			<div className="NewsCard">
				<div className="NewsCard-header">
					<div className="NewsCard-recent">43 MIN</div>
					<div className="NewsCard-time">4:20 pm MAR 7</div>
				</div>
				<div className="NewsCard-hastag-bar">
					<div className="NewsCard-hashtag">#LOCKDOWN</div>
					<div className="NewsCard-hashtag">#SEC144</div>
				</div>
				<div className="NewsCard-body">உலகின் இரண்டாவது அதிக மக்கள் தொகை கொண்ட நாட்டின் பெரும்பகுதியை பூட்டுவதற்கு இந்தியாவின் நடவடிக்கை போதுமானதாக இருக்காது, ஏனெனில் ஆயிரக்கணக்கான முக்கிய ரயில் நிலையங்கள் தங்கள் கிராமங்களுக்குச் செல்வதற்கு முன்பாக ஆயிரக்கணக்கான முக்கிய ரயில் நிலையங்களுக்கு வந்து, நாட்டின் பரந்த எல்லைக்கு தொற்றுநோயைக் கொண்டு செல்லும் அபாயத்தைக் கொண்டுள்ளன.</div>
				<div className="NewsCard-footer">
					<div className="NewsCard-source">Economic Times</div>
					<div className="NewsCard-share">
						<img alt="" className="NewsCard-share-icon" src={require('./assets/share.png')}/>
						<a href="whatsapp://send?text=Hieeee" data-action="share/whatsapp/share">
							<img alt="" className="NewsCard-whatsapp-icon" src={require('./assets/whatsapp.png')}/>
						</a>
					</div>
				</div>
			</div>
		)
		}
}

function StateHelp(){
	return(
		<div className="StateHelp">
			<div className="StateHelpBtn"></div>
			<div className="StateHelpBtn"></div>
		</div>
	)
};


class CardsPane extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			langVal: this.props.langVal
		}
	}
	render() {
		return (<div className="CardsPaneHolder">
			<div className="CardsPane" style={{
					marginLeft: this.props.langVal * -100 + 'vw'
				}}>
				<div className="CardsLang">
					<StateHelp/>
					<StateInfoCard/>
					<NewsCard/>
					<NewsCard/>
					<NewsCard/>
				</div>
				<div className="CardsLang">
					<StateHelp/>
					<StateInfoCard/>
					<NewsCard/>
					<NewsCard/>
					<NewsCard/>
				</div>
			</div>
		</div>)
	}
}

class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			stateSet:{
				state:'Tamil Nadu',
				lang:[
					{
						name:'tamil',
						glyph:'அ'
					}
				],
				selLang:0
			}
		}
		this.updateSet = this.updateSet.bind(this);
	}

	updateSet(stateSet) {
		console.log(stateSet)
		//var estate = stateSet.state;
		//this.setState({stateSet: s});
	}

	render() {
		return (<div className="App">
			<AppTitleBar/>
			<AppSetBar callbackSet={this.updateSet} stateSet={this.state.stateSet}/>
			<CardsPane langVal={this.state.stateSet.selLang}/>
		</div>);
	}
}

export default App;
