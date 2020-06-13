import React from 'react';
import classNames from 'classnames';
import AppTitleBar from './components/AppTitleBar';

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
					<div className="MoreComingSoon">More states coming soon...</div>
				</div>
			</div>
		)
	}
}


function FormatShare(digest){
	let msg=""

	msg="whatsapp://send?text=";
	msg=msg+"*"+digest.headline.trim()+'*  %0A%0A';
	msg=msg+'_'+formatDate(digest.date)+'  |  '+digest.src+'_ %0A%0A';
	msg=msg+digest.digest+'%0A%0A';;
	msg=msg+"*Shared from https://covidwire.in* %0AOne stop for short and sharable authentic info about Covid19 in multiple regional languages. %0A%0A";
	msg=msg+"Source : "+digest.link.split('//')[1];


	return msg
}



function NewsCard(props){

	return(
		<div className="NewsCard">
			<div className={classNames("CardHeader","CardRegion"+props.cardData.region)}>
				<div className="CardDomain">{props.cardData.domain}</div>
				<div className="CardTitle">{props.cardData.headline}</div>
			</div>
			<div className="CardTime">{props.cardData.time}</div>
			<div className="CardBody">{props.cardData.digest}</div>
			<div className="CardFooter">
				<a href={props.cardData.link} className="CardSource" target="_blank" rel="noopener noreferrer">{props.cardData.src}</a>
				<a href={FormatShare(props.cardData)}>
					<img onClick={()=>logFirebase({'share-news':props.cardData.hash})} className="CardShare" src={require("./assets/whatsapp.png")} alt="Whatsapp"/>
				</a>
			</div>
		</div>
	)
}

function RegionFilter(props){
	return(
		<div className="RegionFilter">
			<div className={
				classNames("RegionFilterOpt RFOpt-1",{"RFOpt-1-sel":props.selOpt===1})} onClick={()=>props.changeFilterOpt(1)}>
			All</div>
			<div className={
				classNames("RegionFilterOpt RFOpt-2",{"RFOpt-2-sel":props.selOpt===2})} onClick={()=>props.changeFilterOpt(2)}>
			Global</div>
			<div className={
				classNames("RegionFilterOpt RFOpt-3",{"RFOpt-3-sel":props.selOpt===3})} onClick={()=>props.changeFilterOpt(3)}>
			National</div>
			<div className={
				classNames("RegionFilterOpt RFOpt-4",{"RFOpt-4-sel":props.selOpt===4})} onClick={()=>props.changeFilterOpt(4)}>
			State</div>

		</div>
	)
}


class NewsFeed extends React.Component{
	constructor(props){
		super(props)
		this.state={
			filterOpt:1,
			showScroll:false
		}
		this.changeFilterOpt=this.changeFilterOpt.bind(this)
		this.hideScroll=this.hideScroll.bind(this)
		this.scrollToTop=this.scrollToTop.bind(this)
	}
	//NEED BETTER STATE MANAGEMENT
	changeFilterOpt(opt){
		this.setState({
			filterOpt:opt
		})
	}
	componentDidMount(){
        window.addEventListener('scroll', this.hideScroll);
    }

    componentWillUnmount(){
         window.removeEventListener('scroll', this.hideScroll);
    }

	hideScroll(){
		if(document.documentElement.scrollTop>300){
			this.setState({showScroll:true})
		}
		else{
			this.setState({showScroll:false})
		}
	}

	scrollToTop(){
  		const c = document.documentElement.scrollTop || document.body.scrollTop;
  		if (c > 0) {
    		window.requestAnimationFrame(this.scrollToTop);
    		window.scrollTo(0, c - c / 8);
  		}
	};

	render(){
		let filterDict={
			1:['Global','National','State'],
			2:['Global'],
			3:['National'],
			4:['State']
		}
		let allNewsCards=this.props.feedData;
		let newsCards=<div className="FeedMsg">Fetching News...</div>
		if(allNewsCards!==undefined){
			let filterCards=allNewsCards.filter((item)=>
				(filterDict[this.state.filterOpt].indexOf(item['region'])!==-1)
			)
			let last_date=''
			newsCards=[]
			for(var i=0;i<filterCards.length;i++){
				let d=filterCards[i].date.split('T')[0];
				if(d!==last_date){
					newsCards.push(<div key={"Date-"+i} className="FeedDate">{formatDate(d)}</div>)
				}last_date=d;
				newsCards.push(<NewsCard key={'card-'+i} cardData={filterCards[i]}/>)
				if(i===3){
					newsCards.push(
						<a key="ShareCard" href="whatsapp://send?text=Have you checked out *CovidWire* ? This webapp is a quick stop for *short and shareable authentic information about COVID19, accessible in multiple regional languages* .%0A%0AIt is a volunteer powered initiative, so you could be a part of it too!%0A%0AVisit and checkout this project at https://covidwire.in.">
						<img onClick={()=>logFirebase('Share CovidWire')} alt="Share CovidWire" src={require('./assets/sharecard.png')} className="InAppCards"/>
						</a>)
				}
				if(i===5){
					newsCards.push(
						<a key="JoinCard" href="https://covidwire.in/s/join" target="_blank" rel="noopener noreferrer">
							<img  alt="Join CovidWire" src={require('./assets/joincard.png')} className="InAppCards"/>
						</a>)
				}
			}
		}else{

		}

		if(newsCards.length===0)
			newsCards=<div className="FeedMsg">Nothing here yet, will get back with more news soon!</div>

		return(
			<div className="NewsFeed">
				<div className="DesktopBlock"></div>
				<RegionFilter selOpt={this.state.filterOpt} changeFilterOpt={this.changeFilterOpt}/>
				{newsCards}
				<img src={require("./assets/scrolltop.png")} alt="Scroll to Top" className={ classNames("ScrollTop",{"ScrollTopView":this.state.showScroll})} onClick={this.scrollToTop}/>

			</div>
		)
	}
}

function formatDate(date_str) {
	date_str=date_str.split('T')[0]
	let month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	let date_arr = date_str.split('-');

  	return Number(date_arr[2])+' '+month[Number(date_arr[1]) - 1]+' '+date_arr[0]
}

function timeSince(date) {

	date=date.split('.')[0]+'+05:30';
	date=new Date(date)
	date=date.getTime()

	var seconds = Math.floor((new Date() - date) / 1000);
  	var interval = Math.floor(seconds / 31536000);

  	interval = Math.floor(seconds / 86400);
  	if (interval >= 1) {
		if(interval===1)return "1 day ago";
		return interval + " days ago";
	}


	return "Today"
  	interval = Math.floor(seconds / 3600);
  	if (interval >= 1) {return interval + " hrs ago";}

  	interval = Math.floor(seconds / 60);
  	return interval + " mins ago";

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
		this.formatPageUrl=this.formatPageUrl.bind(this)
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

	formatPageUrl(num){
		const pageSize=10;
		let end=new Date(new Date().setDate(new Date().getDate()-pageSize*num)).toISOString().split('T')[0];

		let start=new Date(new Date().setDate(new Date().getDate()-
		(pageSize*(num+1)-1))).toISOString().split('T')[0];

		return '?orderBy="$key"&startAt="'+start+'"&endAt="'+end+'"';
		//total pageSize days including today
	}

	getStateData(state){
		let baseUrl="https://covidwire.firebaseio.com/feed/"
		let url=baseUrl+state+'.json'+this.formatPageUrl(0)

		fetch(url)
		.then(
			(result)=>result.json()
		.then(
			(result)=>{
				if(result!=null){
					let flatDict={}
					Object.values(result).forEach((item, i) => {
						flatDict=Object.assign({}, flatDict, item);
					});
					this.setState({
						stateData:result,
						feedList:this.formatFeed(state,flatDict)
					})
				}
			}
		))
	}

	formatFeed(state,rawData){
		let recList=Object.values(rawData)

		let langList=this.state.meta.stateDict[state].concat(['English'])
		let feedList=langList.map(x=>[])
		recList.sort((a,b)=>(b['published_time'].localeCompare(a['published_time'])))
		recList.forEach((record, i) => {
			let commDigest={
				hash:record['hash'],
				//time:timeSince(record['published_time']),
				time:formatDate(record['published_time'].split('T')[0]),
				date:record['published_time'],
				src:record['src_name'],
				link:"https://covidwire.in/s/"+record['hash'],
				domain:record['domain'],
				region:(['Global','National'].includes(record['region']))?record['region']:'State',
			}

			langList.forEach((lang, i) => {
				let langDigest={...commDigest}
				if(lang in record['digests']){

					langDigest['digest']=record['digests'][lang]['digest']
					langDigest['headline']=record['digests'][lang]['headline']

					feedList[langList.indexOf(lang)].push(langDigest)
				}

			});

		});
		return feedList;
	}

	render(){

		return (
	      <div className="App">
	  		<AppTitleBar navSel="home"/>
	  		<SettingsBar metaData={this.state.meta} currState={this.state.currState} changeCurrState={this.changeCurrState}/>
	  		<NewsFeed feedData={this.state.feedList[this.state.currState.lang]}/>
			<div className="DesktopDesc">One stop for short and sharable authentic info about Covid19 in multitude of regional languages.</div>
	      </div>
	    );
	}
}



function logFirebase(content){
	try {
		//firebase.analytics().logEvent(content)
	}catch{

	}
	console.log(content)
}
let metaRaw={'stateDict': {'Andhra Pradesh': ['Telugu'], 'Maharashtra': ['Marathi'], 'Delhi': ['Hindi']}, 'langDict': {'Telugu': ['Andhra Pradesh'], 'Marathi': ['Maharashtra'], 'Hindi': ['Delhi']}}


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

//take meta completely outside everything
export default App;
