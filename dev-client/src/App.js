import React from 'react';
import {stateData,defaultLang,glyphDict} from './stateList'


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
				this.props.callbackSet(this.state.stateSet,true);
		});
	}

	viewStates() {
		if (this.state.stateView) {
			this.setState({'stateView': false})
		} else {
			this.setState({'stateView': true})
		}
	}

	selState(stateVal) {
		let stateSet = {...this.state.stateSet}
		stateSet.state = stateVal;

		stateVal=stateVal.toLowerCase().replace(/ /g,'-')
		stateVal=metaData[stateVal]['lang'];
		stateSet.lang=stateVal.map(x=>({'name':x,'glyph':glyphDict[x]}));

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

	stateNames=Object.entries(metaData);
	stateNames=this.stateNames.filter(state=>state[1].status=='Live')

	stateList=(<div className="StateItemList">{this.stateNames.map(x=>(
		<div className="StateItem" onClick={()=>this.selState(x[1].name)} key={'sl-'+x[1].name}>{x[1].name}</div>
	))}</div>)


	render() {
		let langList=(<div>{this.state.stateSet.lang.map((x,i)=>this.fillLang(x,i))}</div>)
		return (
		<div className="AppSetBar">
			<div className="StateName" onClick={this.viewStates}>{this.state.stateSet.state} </div>

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
		let wa_share='*'+this.props.digest['hashtag'].join(' ').replace(/#/g,'%23')+'* %0A%0A'
		+this.props.digest['body']+'%0A%0ARead more at '+this.props.digest['link'];

		return (
			<div className="NewsCard">
				<div className="NewsCard-header">
					<div className="NewsCard-recent">{this.props.digest['recent']}</div>
					<div className="NewsCard-time">{this.props.digest['time']}</div>
				</div>
				<div className="NewsCard-hastag-bar">
					<div className="NewsCard-hashtag">{this.props.digest['hashtag'][0]}</div>
					<div className="NewsCard-hashtag">{this.props.digest['hashtag'][1]}</div>
				</div>
				<div className="NewsCard-body">{this.props.digest['body']}</div>
				<div className="NewsCard-footer">
					<div className="NewsCard-source">{this.props.digest['src_name']}</div>
					<div className="NewsCard-share">
						<img alt="" className="NewsCard-share-icon" src={require('./assets/share.png')}/>
						<a href={"whatsapp://send?text="+wa_share} data-action="share/whatsapp/share">
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
			lang: this.props.lang[0],
			selLang : this.props.lang[1],
			stateNews:this.props.stateNews
		}
	}
	render() {
		let month=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
		let langWiseNews=Array(this.state.lang.length).fill(0).map(x=>[])
		this.props.stateNews.forEach((item,i) => {
			let comm_digest={}

			let [d,t]=item['time'].split('T');
			d=d.split('-')[2]+' '+month[parseInt(d.split('-')[1])-1]

			var H = +t.substr(0, 2);
			var h = (H % 12) || 12;
			var ampm = H < 12 ? " AM" : " PM";
			t = h + t.substr(2, 3) + ampm;

			comm_digest['time']=t+' | '+d;
			comm_digest['recent']='43 MIN';
			comm_digest['link']=item['src_dynlink'];
			comm_digest['src_name']=item['src_name'].toUpperCase();

			item["content"].forEach((item, j) => {
				let digest={...comm_digest}
				digest['body']=item['body']
				digest['hashtag']=item['topic'].map(x=>'#'+x.replace(/ /g,"_"))
				langWiseNews[j].push(<NewsCard digest={digest} key={'card-'+i+'-'+j}/>)
			});
		});

		let AllCards=[]
		langWiseNews.forEach((item, i) => {
			AllCards.push(<div className="CardsLang" key={'pane-'+i}>{item}</div>)
		});

		return (<div className="CardsPaneHolder">
			<div className="CardsPane">
				{langWiseNews[this.props.lang[1]]}
			</div>
		</div>)
	}
}

class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			stateSet:{
				state:'Delhi',
				lang:[
					{
						name:'English',
						glyph:'A'
					},
					{
						name:'Hindi',
						glyph:'अ'
					}
				],
				selLang:0
			},
			stateNews:initData
		}
		this.updateSet = this.updateSet.bind(this);
		this.getStateNews = this.getStateNews.bind(this);
	}

	getStateNews(state){
		var url="https://covidwire.firebaseio.com/states/"+state.toLowerCase().replace(/ /g,'-')+".json";
		var xmlHttp = new XMLHttpRequest();
	    xmlHttp.open( "GET", url, false );
	    xmlHttp.send( null );
	    var data=JSON.parse(xmlHttp.responseText);
		this.setState({stateNews:data})
	}

	updateSet(stateSet,langChange=false) {
		this.setState({stateSet: stateSet});
		if(!langChange)this.getStateNews(stateSet['state'])
	}

	render() {
		return (<div className="App">
			<AppTitleBar/>
			<AppSetBar callbackSet={this.updateSet} stateSet={this.state.stateSet}/>
			<CardsPane stateNews={this.state.stateNews} lang={[["Hindi", "English"],this.state.stateSet.selLang]}/>
		</div>);
	}
}



let initData=[
    {
        "content": [
            {
                "body": "Prime Minister Narendra Modi is holding a virtual meeting with Chief Ministers on the ninth day of the lockdown. India has reported 2315 COVID-19 cases till date. Most of the cases reported on Thursday were linked to the Nizamuddin cluster.",
                "topic": [
                    "LOCKDOWN",
                    "STAY AT HOME"
                ]
            },
            {
                "body": "प्रधानमंत्री नरेंद्र मोदी तालाबंदी के नौवें दिन मुख्यमंत्रियों के साथ आभासी बैठक कर रहे हैं। भारत ने अब तक 2315 COVID-19 मामलों की सूचना दी है। गुरुवार को रिपोर्ट किए गए अधिकांश मामले निजामुद्दीन क्लस्टर से जुड़े थे।",
                "topic": [
                    "लॉकडाउन",
                    "घर पर रहो"
                ]
            }
        ],
        "lang": [
            "ENG",
            "HIN"
        ],
        "region": "Global",
        "src_dynlink": "https://cwire.page.link/iPUX",
        "src_link": "https://www.thehindu.com/news/national/india-coronavirus-lockdown-april-2-2020-live-updates/article31233014.ece",
        "src_name": "The Hindu",
        "time": "2020-04-04T00:44:00"
    },
    {
        "content": [
            {
                "body": "Adversity makes strange bedfellows and the current global Covid-19 pandemic has proved to be no exception. Big tobacco companies have joined pharma companies in the race for a vaccine — one that can potentially contain the deadly disease that has affected almost a million people worldwide and killed tens of thousands",
                "topic": [
                    "VACCINE",
                    "TEST KITS"
                ]
            },
            {
                "body": "प्रतिकूलता अजीब बेडफ़्लो बनाती है और मौजूदा वैश्विक कोविद -19 महामारी कोई अपवाद नहीं है। बड़ी तंबाकू कंपनियों ने वैक्सीन की दौड़ में फार्मा कंपनियों को शामिल कर लिया है - एक ऐसी बीमारी जिसमें संभावित रूप से जानलेवा बीमारी हो सकती है जिसने दुनिया भर में लगभग दस लाख लोगों को प्रभावित किया है और हजारों लोगों को मार डाला है",
                "topic": [
                    "टीका",
                    "टेस्ट किट"
                ]
            }
        ],
        "lang": [
            "ENG",
            "HIN"
        ],
        "region": "National",
        "src_dynlink": "https://cwire.page.link/qLo3",
        "src_link": "https://economictimes.indiatimes.com/news/international/business/big-tobacco-companies-join-race-for-covid-vaccine/articleshow/74942648.cms",
        "src_name": "Economic Times",
        "time": "2020-04-01T19:30:00"
    },
    {
        "content": [
            {
                "body": "Maharashtra, which has reported the highest number of confirmed cases of the pandemic, saw three new cases on Thursday, taking the state tally to 338. At 265, Kerala has the second highest number of cases in India. As many as 21 cases were reported in Andhra Pradesh on Thursday. The state count now stands at 132. Twelve more coronavirus patients were found in Madhya Pradesh’s Indore, taking the total number of such cases in the state to 98.",
                "topic": [
                    "NEW CASES",
                    "STAY AT HOME"
                ]
            },
            {
                "body": "महाराष्ट्र, जिसने महामारी के सबसे अधिक पुष्टि मामलों की रिपोर्ट की है, ने गुरुवार को तीन नए मामले देखे, जो राज्य को 338 तक ले गए। 265 पर, केरल में भारत में मामलों की दूसरी सबसे अधिक संख्या है। आंध्र प्रदेश में गुरुवार को 21 मामले सामने आए। राज्य की गिनती अब 132 पर है। मध्य प्रदेश के इंदौर में बारह और कोरोनोवायरस रोगी पाए गए, जो राज्य में ऐसे मामलों की कुल संख्या 98 तक ले गए।",
                "topic": [
                    "नए मामले",
                    "घर पर रहो"
                ]
            }
        ],
        "lang": [
            "ENG",
            "HIN"
        ],
        "region": "National",
        "src_dynlink": "https://cwire.page.link/L6JA",
        "src_link": "https://www.indiatoday.in/india/story/coronavirus-india-covid-19-tally-total-number-cases-news-update-1662442-2020-04-02",
        "src_name": "India Today",
        "time": "2020-04-01T19:00:00"
    },
    {
        "content": [
            {
                "body": "We have received 830 calls on an average in the last 11 days with maximum calls related to movement passes. We received 1,053 emergency calls between March 31 and April 1 till 2 pm and 696 cases were registered related to movement passes. At least 160 outside calls were made from the adjoining cities, 29 calls were related to no food and no money.",
                "topic": [
                    "NEW SPREAD",
                    "ISOLATION"
                ]
            },
            {
                "body": "हमें पिछले 11 दिनों में औसतन 830 कॉल प्राप्त हुए हैं, जिसमें आंदोलन पास से संबंधित अधिकतम कॉल हैं। हमें 31 मार्च से 1 अप्रैल के बीच दोपहर 2 बजे तक 1,053 आपातकालीन कॉल प्राप्त हुए और 696 मामले आंदोलन पास से संबंधित दर्ज किए गए। निकटवर्ती शहरों से कम से कम 160 बाहर कॉल किए गए, 29 कॉल न भोजन और न पैसे से संबंधित थे।",
                "topic": [
                    "नया प्रसार",
                    "अलगाव"
                ]
            }
        ],
        "lang": [
            "English",
            "Hindi"
        ],
        "region": "Regional",
        "src_dynlink": "https://cwire.page.link/uy1b",
        "src_link": "https://www.indiatoday.in/mail-today/story/covid-19-lockdown-petty-crimes-decline-delhi-1662725-2020-04-03",
        "src_name": "India Today",
        "time": "2020-03-26T09:35:00"
    },
    {
        "content": [
            {
                "body": "These cases included 259 who were evacuated from the Markaz or religious centre of Islamic missionary group Tabhlighi Jamaat which violated rules and held a massive congregation in Delhi's Nizamuddin area last month with attendees from countries like Malaysia and Kyrgyzstan.",
                "topic": [
                    "NEW CASE",
                    "CAPITAL"
                ]
            },
            {
                "body": "इन मामलों में 259 शामिल थे जिन्हें इस्लामी मिशनरी समूह तब्लीगी जमात के मार्काज़ या धार्मिक केंद्र से निकाला गया था, जिन्होंने नियमों का उल्लंघन किया था और पिछले महीने दिल्ली के निज़ामुद्दीन क्षेत्र में एक विशाल मण्डली का आयोजन किया था जिसमें मलेशिया और किर्गिस्तान जैसे देशों के उपस्थित थे।",
                "topic": [
                    "नया केस",
                    "राजधानी"
                ]
            }
        ],
        "lang": [
            "English",
            "Hindi"
        ],
        "region": "Regional",
        "src_dynlink": "https://cwire.page.link/AvmB",
        "src_link": "https://www.ndtv.com/delhi-news/coronavirus-covid-19-delhi-prepared-if-it-spreads-says-arvind-kejriwal-as-cases-near-400-2205755",
        "src_name": "NDTV",
        "time": "2020-03-12T05:04:00"
    }
]

let metaData={"andhra-pradesh":{"lang":["English","Telugu"],"name":"Andhra Pradesh","status":"Empty","type":"Native"},"delhi":{"lang":["English","Hindi"],"name":"Delhi","status":"Live","type":"Hindi"},"haryana":{"lang":["English","Hindi"],"name":"Haryana","status":"Live","type":"Hindi"},"karnataka":{"lang":["English","Kannada"],"name":"Karnataka","status":"Empty","type":"Native"},"maharashtra":{"lang":["English","Marathi"],"name":"Maharashtra","status":"Empty","type":"Native"},"tamil-nadu":{"lang":["English","Tamil"],"name":"Tamil Nadu","status":"Live","type":"Native"},"telangana":{"lang":["English","Telugu"],"name":"Telangana","status":"Live","type":"Native"},"uttar-pradesh":{"lang":["English","Hindi"],"name":"Uttar Pradesh","status":"Live","type":"Hindi"}}

export default App;
