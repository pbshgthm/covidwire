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
					<a href="/" className="AppTitle">CovidWire
						<img alt="CovidWire Logo" src={require("./assets/logo.png")} className="AppLogo"/>
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
				<img className="SidepaneBack" alt="Hide Side Pane" src={require("./assets/back.png")} onClick={props.togglePane}/>
				<div className="SidePaneName">CovidWire
					<img alt="CovidWire Logo" src={require("./assets/logo-dark.png")} className="SidePaneLogo"/>
				</div>
				<div className="SidePaneNav">
					<div className="SidePaneLinks SidePaneLinks-sel"><a href="/">Home</a></div>
					<div className="SidePaneLinks"><a href="/about">About Us</a></div>
					<div className="SidePaneLinks"><a href="/team">Our Team</a></div>
					<div className="SidePaneLinks"><a href="https://covidwire.in/s/joinus" target="_blank" rel="noopener noreferrer">Join Us</a></div>
				</div>
				<div className="SidePaneHi">
					<div className="SidePaneHiText">Say Hi!</div>
					<div className="SidePaneContact">
						<img className="SidePaneContactIcon" src={require("./assets/mail.png")} alt="Email"/>
						<a href="mailto:hello@covidwire.in" target="_blank" rel="noopener noreferrer">
							hello@covidwire.in
						</a>
					</div>
					<div className="SidePaneContact-ph">
						<img className="SidePaneContactIcon" src={require("./assets/phone.png")} alt="Phone"/>
						<a href="tel:+91 7400401323" target="_blank" rel="noopener noreferrer" >7400401323</a> |
						<a href="tel:+91 6305660413" target="_blank" rel="noopener noreferrer" > 6305660413</a>
					</div>
					<div className="SidePaneContact">
						<img className="SidePaneContactIcon" src={require("./assets/instagram.png")} alt="Instagram"/>
						<a href="https://instagram.com/covid.wire" target="_blank" rel="noopener noreferrer">
							covid.wire
						</a>
					</div>
				</div>
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
		document.getElementsByClassName('NewsFeed')[0].classList.remove("NewsFeed-blur");
		document.body.style.overflow = "scroll";

		this.setState({
			currState:{
				name:this.state.currState.name,
				lang:langInd
			},
			showList:false
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
				<div className="CurrStateLabel">Select State</div>
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


function FormatShare(digest,isWa=true){
	let msg=""
	if(isWa){
		msg="whatsapp://send?text="
		msg=msg+digest.digest+'%0A%0A'
		let ht=digest.hashtags.map(x=>('%23'+x)).join(' ')
		msg=msg+'*'+ht+'* %0A%0A'
		msg=msg+"Original Source: "+digest.link+'%0A%0A'
		msg=msg+"*Shared from https://covidwire.in* %0AOne stop for short and sharable authentic info about Covid19 in multitude of regional languages."

	}
	else{
		msg=msg+digest.digest+'\n\n'
		let ht=digest.hashtags.map(x=>('#'+x)).join(' ')
		msg=msg+ht+'\n\n'
		msg=msg+"Original Source: "+digest.link+"\n\n"
		msg=msg+"Shared from https://covidwire.in \nOne stop for short and sharable authentic info about Covid19 in multitude of regional languages."

	}

	return msg
}


function CopyClipboard(str){
  	const el = document.createElement('textarea');
  	el.value = str;
  	document.body.appendChild(el);
  	el.select();
  	document.execCommand('copy');
  	document.body.removeChild(el);
};

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

					<img onClick={()=>CopyClipboard(FormatShare(props.cardData,false))} src={require('./assets/share.png')} className="CardShareIcons CSCB" alt="Share Link"/>
					<a href={FormatShare(props.cardData)}>
						<img src={require('./assets/whatsapp.png')} className="CardShareIcons" alt="Share on WhatsApp"/>
					</a>

				</div>
			</div>
		</div>
	)
}

function FeedFilter(props){

	return(
		<div className="FeedFilter">
			<div className={
				classNames("FeedFilterOpt FFOpt-1",{"FFOpt-1-sel":props.selOpt===1})} onClick={()=>props.changeFilterOpt(1)}>
			All</div>
			<div className={
				classNames("FeedFilterOpt FFOpt-2",{"FFOpt-2-sel":props.selOpt===2})} onClick={()=>props.changeFilterOpt(2)}>
			Global</div>
			<div className={
				classNames("FeedFilterOpt FFOpt-3",{"FFOpt-3-sel":props.selOpt===3})} onClick={()=>props.changeFilterOpt(3)}>
			National</div>
			<div className={
				classNames("FeedFilterOpt FFOpt-4",{"FFOpt-4-sel":props.selOpt===4})} onClick={()=>props.changeFilterOpt(4)}>
			State</div>

		</div>
	)
}


class NewsFeed extends React.Component{
	constructor(props){
		super(props)
		this.state={
			filterOpt:1
		}
		this.changeFilterOpt=this.changeFilterOpt.bind(this)
	}
	//NEED BETTER STATE MANAGEMENT
	changeFilterOpt(opt){
		this.setState({
			filterOpt:opt
		})
	}

	render(){
		let filterDict={
			1:['global','national','state'],
			2:['global'],
			3:['national'],
			4:['state']
		}
		let allNewsCards=this.props.feedData;
		let newsCards=<div className="FeedMsg">Fetching News...</div>
		if(allNewsCards!==undefined){
			newsCards=allNewsCards.filter((item)=>
				(filterDict[this.state.filterOpt].indexOf(item['region'])!==-1)
			)
			newsCards=newsCards.map((x,i)=>(<NewsCard key={'card-'+i} cardData={x}/>));
		}else{

		}

		if(newsCards.length==0)
			newsCards=<div className="FeedMsg">Nothing here yet, will get back with more news soon!</div>

		return(
			<div className="NewsFeed">
				<div className="DesktopBlock"></div>
				<FeedFilter selOpt={this.state.filterOpt} changeFilterOpt={this.changeFilterOpt}/>
				{newsCards}
			</div>
		)
	}
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



function getUrlParams(){
	let params = new URLSearchParams(window.location.search);
	let s=params.get('s')
	let l=params.get('l')
	let state,lang;

	try{
		state=Object.keys(stateCode).filter(function(key) {return stateCode[key] === s})[0];
		lang=Object.keys(langCode).filter(function(key) {return langCode[key] === l})[0];
		if(lang==='English')lang=1;
		else lang=0;
		if(state===undefined)throw Error("No Param")
		if(!(state in metaRaw['stateDict']))throw Error("Bad param")
	}catch (e){
		console.log(e)
		state='Delhi'
		lang=1;
	}
	//NEED TO FIGURE OUT FOR MULTI LANG
	return {name:state,lang:lang}
}


class App extends React.Component{
	constructor(props){
		super(props)

		let meta={...metaRaw};
		meta['stateList']=Object.keys(meta['stateDict']).sort();
		meta['langList']=Object.keys(meta['langDict']).sort();

		this.state={
			meta:meta,
			currState:getUrlParams(),
			stateData:{},
			feedList:[]
		}
		this.getStateData=this.getStateData.bind(this)
		this.changeCurrState=this.changeCurrState.bind(this)
		this.formatFeed=this.formatFeed.bind(this)
		this.fetchFromCache=this.fetchFromCache.bind(this)

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

		let availLang=this.state.meta['stateDict'][currState.name].concat(['English'])
		let s=stateCode[currState.name]
		let l=langCode[availLang[currState.lang]]

		let params = new URLSearchParams(window.location.search);
		params.set('s', s);
		params.set('l', l);
		this.props.history.push(window.location.pathname + "?" + params.toString());

	}

	fetchFromCache(url) {
		// No cache exists, return null
		if(!('caches' in window)) {
			return null;
		}
		// Return cached response
		return caches.match(url).then((response) => {
			return response;
		}).catch((err) => {
			console.log('Error in getting response from cache for URL - ', url);
			return null;
		});
	}

	getStateData(state){
		let baseUrl='https://covidwire.firebaseio.com/launch/'
		let url=baseUrl+state+'.json'

		this.fetchFromCache(url)
			.then(
				function (result) {
					if(result)
						return result.json()
						.then(
							(result) => {
								if (result != null) {
									this.setState({
										stateData: result,
										feedList: this.formatFeed(state, result)
									})
								}
							}
						)
				} 
			)


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
		let langList=this.state.meta.stateDict[state].concat(['English'])
		let feedList=langList.map(x=>[])
		recList.sort((a,b)=>(b['published_time'].localeCompare(a['published_time'])))
		recList.forEach((record, i) => {
			let commDigest={
				hash:record['hash'],
				time:timeSince(record['published_time']),
				src:record['src_name'],
				link:record['short_link'],
				region:(['Global','National'].includes(record['region']))?record['region'].toLowerCase():'state',
			}

			langList.forEach((lang, i) => {
				let langDigest={...commDigest}
				if(lang in record['digests']){

					let a='translation'
					if(lang==='English')a='digest';
					langDigest['lang']=lang
					langDigest['digest']=record['digests'][lang][a]
					langDigest['hashtags']=record['digests']['English']['hashtags']

					feedList[langList.indexOf(lang)].push(langDigest)
				}

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
			<div className="DesktopDesc">One stop for short and sharable authentic info about Covid19 in multitude of regional languages.</div>
	      </div>
	    );
	}
}


let metaRaw={'stateDict': {'Telangana': ['Telugu'], 'Andhra Pradesh': ['Telugu'], 'Maharashtra': ['Marathi'], 'Haryana': ['Hindi'], 'Tamil Nadu': ['Tamil'], 'Delhi': ['Hindi'], 'Uttar Pradesh': ['Hindi']}, 'langDict': {'Telugu': ['Telangana', 'Andhra Pradesh'], 'Marathi': ['Maharashtra'], 'Hindi': ['Haryana', 'Delhi', 'Uttar Pradesh'], 'Tamil': ['Tamil Nadu']}}

let metaRawX={'stateDict': {'Telangana': ['Telugu'], 'Andhra Pradesh': ['Telugu'], 'Haryana': ['Hindi'], 'Tamil Nadu': ['Tamil'], 'Delhi': ['Hindi'], 'Uttar Pradesh': ['Hindi']}, 'langDict': {'Telugu': ['Telangana', 'Andhra Pradesh'], 'Hindi': ['Haryana', 'Delhi', 'Uttar Pradesh'], 'Tamil': ['Tamil Nadu']}}


let stateCode={
	'Delhi':'dl',
	'Haryana':'hr',
	'Telangana':'tl',
	'Andhra Pradesh':'ap',
	'Tamil Nadu':'tn',
	'Maharashtra':'mh',
	'Uttar Pradesh':'up'
}
let langCode={
	'Tamil':'tam',
	'Hindi':'hin',
	'English':'eng',
	'Telugu':'tel'
}

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
