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
					<img className="AppMenuBtn" onClick={this.togglePane} src={require("./assets/menu.png")}  alt="Show Menu"/>
					<div className="AppTitle">CovidWire
						<img alt="CovidWire Logo" src={require("./assets/logo.png")} className="AppLogo"/>
					</div>
				</div>
			</div>)
	}
}

function SidePane(props){
	return(
		<div>
			<div className={classNames('BgBlock',{"BgBlock-sel":props.showPane})}></div>
			<div className={classNames('SidePane',{"SidePane-sel":props.showPane})}>
				<img className="SidepaneBack" alt="Hide Side Pane" src={require("./assets/back.png")} onClick={props.togglePane}/>
			</div>
		</div>
	)
}

class SettingsBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showList:false,
			currState:this.props.currState,
		}
		this.toggleStateList=this.toggleStateList.bind(this)
		this.changeStateName=this.changeStateName.bind(this)
	}

	toggleStateList(){
		if(this.state.showList){
			document.getElementsByClassName('NewsFeed')[0].classList.remove("NewsFeed-blur");
			document.body.style.overflow = "scroll";
			this.setState({showList:false})
		}
		else{
			document.getElementsByClassName('NewsFeed')[0].classList.add("NewsFeed-blur");
			document.body.style.overflow = "hidden";
			this.setState({showList:true})
		}
	}

	changeStateName(state){
		document.getElementsByClassName('NewsFeed')[0].classList.remove("NewsFeed-blur");
		document.body.style.overflow = "scroll";

		this.setState({
			currState:{
				name:state,
				lang:1
			},
			showList:false
		},()=>this.props.changeCurrState(this.state.currState))

	}

	changeLang(langInd){
		this.setState({
			currState:{
				name:this.state.currState.name,
				lang:langInd
			}
		},()=>this.props.changeCurrState(this.state.currState))
	}

	render(){

		let stateList=this.props.metaData['stateList']
		stateList=stateList.map(x=>({'name':x,
			'glyph': this.props.metaData['stateDict'][x].map(y=>glyphDict[y]).concat(["A"])
		}))


		let stateListContent=stateList.map(x=>(
			<div key={"statelist-"+x.name} className={classNames("StateListItem",{"StateListItem-sel":(x.name===this.state.currState.name)})} onClick={()=>this.changeStateName(x.name)}>
				<div className="StateListName">{x.name}</div>
				<div className="StateListLang">{x.glyph.join(' ')}</div>
			</div>
		))


		let langOpt = this.props.metaData['stateDict'][this.state.currState.name].map(x=>glyphDict[x]).concat(["A"])
		let currLang=langOpt.map((x,i)=>(<div key={"currlang-"+x} className=
			{"LangOpt"+((i===this.state.currState.lang)?" LangOpt-sel":"")} onClick={()=>this.changeLang(i)}>
		{x}</div>))


		return(
			<div className="SettingsBar">
				<div className={classNames("CurrentBox",{"CurrentBox-sel":this.state.showList})}>
					<div className="CurrStateName" onClick={this.toggleStateList}>{this.state.currState.name}</div>
					<div className="CurrLangBox">
						{currLang}
					</div>
				</div>
				<div className={classNames("StateListBox",{"StateListBox-sel":this.state.showList})}>
					{stateListContent}
				</div>
			</div>
		)
	}
}

function NewsCard(props){
	let hashtags=props.cardData.hashtags.map((x,i)=>(<div key={'hashtag-'+i} className="CardHashtags">{x}</div>))

	return(
		<div className="NewsCard">
			<div className="NewsCardHeader">
				<img src={require('./assets/'+props.cardData.region+'.png')} alt="Region Icon" className="CardRegionIcon"/>
				<div className="CardHashtagsHolder">{hashtags}</div>
				<div className="CardTimeAgo">{props.cardData.time}</div>
			</div>
			<div className="NewsCardBody">{props.cardData.digest}</div>
			<div className="NewsCardFooter">
				<a className="NewsCardSource" target="_blank" rel="noopener noreferrer" href={props.cardData.link}> {props.cardData.src.toUpperCase()}</a>
				<div className="NewsShareBox">
					<a href="https://google.com">
						<img src={require('./assets/share.png')} className="CardShareIcons" alt="Share Link"/>
					</a>
					<a href="https://google.com">
						<img src={require('./assets/whatsapp.png')} className="CardShareIcons" alt="Share on WhatsApp"/>
					</a>

				</div>
			</div>
		</div>
	)
}


function NewsFeed(props){
	//NEED BETTER STATE MANAGEMENT
	let newsCards='';
	try {
		newsCards=props.feedData.map((x,i)=>(<NewsCard key={'card-'+i} cardData={x}/>));
	} catch (e) {
		console.log('loading')
	}

	return(
		<div className="NewsFeed">
			{newsCards}
		</div>
	)
}


function timeSince(date) {

	date=date.split('.')[0]+'+05:30';
	date=new Date(date)
	date=date.getTime()

	var seconds = Math.floor((new Date() - date) / 1000);
  	var interval = Math.floor(seconds / 31536000);

  	interval = Math.floor(seconds / 86400);
  	if (interval > 1) {return interval + " days";}

  	interval = Math.floor(seconds / 3600);
  	if (interval > 1) {return interval + " hrs";}

  	interval = Math.floor(seconds / 60);
  	return interval + " mins";

}


class App extends React.Component{
	constructor(props){
		super(props)

		let meta=metaRaw;
		meta['stateList']=Object.keys(meta['stateDict']).sort();
		meta['langList']=Object.keys(meta['langDict']).sort();

		this.state={
			meta:meta,
			currState:{
				name:'Delhi',
				lang: 1
			},
			stateData:{},
			feedList:[]
		}
		this.getStateData=this.getStateData.bind(this)
		this.changeCurrState=this.changeCurrState.bind(this)
		this.formatFeed=this.formatFeed.bind(this)

	}

	componentDidMount() {
		this.getStateData(this.state.currState.name)
	}

	changeCurrState(currState){


		let currStateNow=this.state.currState;
		if(currState.name!==currStateNow.name){
			this.setState({
				currState:currState,
				feedList:[[],[]]
			})
			this.getStateData(currState.name)
		}else{
			this.setState({
				currState:currState,
			})
		}
	}

	getStateData(state){
		let baseUrl='https://covidwire.firebaseio.com/beta/'
		let url=baseUrl+state+'.json'

		fetch(url)
		.then(
			(result)=>result.json()
		.then(
			(result)=>{
				if(result!=null){
					this.setState({
						stateData:result,
						feedList:this.formatFeed(state,result)
					})
				}
			}
		))
	}

	formatFeed(state,rawData){
		let recList=Object.entries(rawData).map(x=>x[1])
		let langList=this.state.meta.stateDict[state].concat(['english'])
		let feedList=langList.map(x=>[])
		recList.sort((a,b)=>(b['published_time'].localeCompare(a['published_time'])))
		recList.forEach((record, i) => {
			let commDigest={
				hash:record['hash'],
				time:timeSince(record['published_time']),
				src:record['src_name'],
				link:record['src_link'],
				region:(['Global','National'].includes(record['region']))?record['region'].toLowerCase():'state',
			}
			langList.forEach((lang, i) => {
				let langDigest={...commDigest}
				if(lang in record['digests']){
					//UPDATE IN NEXT VERSION
					let a='translation'
					if(lang==='english')a='digest';

					langDigest['lang']=lang
					langDigest['digest']=record['digests'][lang][a]
					langDigest['hashtags']=record['digests']['english']['hashtags']
				}
				feedList[langList.indexOf(lang)].push(langDigest)
			});

		});
		return feedList;
	}

	render(){
		return (
	      <div className="App">
	  		<AppTitleBar/>
	  		<SettingsBar metaData={this.state.meta} currState={this.state.currState} changeCurrState={this.changeCurrState}/>
	  		<NewsFeed feedData={this.state.feedList[this.state.currState.lang]}/>
	      </div>
	    );
	}
}


let metaRawX={'stateDict': {'Telangana': ['Telugu'], 'Andhra Pradesh': ['Telugu'], 'Maharashtra': ['Marathi'], 'Haryana': ['Hindi'], 'Tamil Nadu': ['Tamil'], 'Delhi': ['Hindi'], 'Uttar Pradesh': ['Hindi']}, 'langDict': {'Telugu': ['Telangana', 'Andhra Pradesh'], 'Marathi': ['Maharashtra'], 'Hindi': ['Haryana', 'Delhi', 'Uttar Pradesh'], 'Tamil': ['Tamil Nadu']}}

let metaRaw={'stateDict': {'Telangana': ['Telugu'], 'Andhra Pradesh': ['Telugu'], 'Haryana': ['Hindi'], 'Tamil Nadu': ['Tamil'], 'Delhi': ['Hindi'], 'Uttar Pradesh': ['Hindi']}, 'langDict': {'Telugu': ['Telangana', 'Andhra Pradesh'], 'Hindi': ['Haryana', 'Delhi', 'Uttar Pradesh'], 'Tamil': ['Tamil Nadu']}}


let glyphDict={
	'Malayalam':'അ',
	'Tamil':'அ',
	'Kannada':'ಅ',
	'Telugu':'ఆ',
	'Gujarati':'અ',
	'Odia':'ଆ',
	'English':'A',
	'Hindi':'अ',
	'Marathi':'ळ'
}

export default App;
