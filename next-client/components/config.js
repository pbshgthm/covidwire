const stateConfig={
	'Andhra Pradesh':['Telugu','English'],
	'Delhi':['Hindi','English'],
	'Maharashtra':['Marathi','English'],
}

const langConfig={
	'Hindi':{
		'native':'हिन्दी',
		'glyph':'अ'
	},
	'Marathi':{
		'native':'मराठी',
		'glyph':'ळ'
	},
	'Telugu':{
		'native':'తెలుగు',
		'glyph':'ఆ'
	},
	'English':{
		'native':'English',
		'glyph':'A'
	}
}

const domainConfig=["Healthcare", "Society", "Administration",  "Politics", "Economy", "Legal",  "Science", "Environment", "Sports","Others"]

const regionConfig=["Global","National","Andhra Pradesh","Delhi","Maharashtra"]


const config={
	'state':stateConfig,
	'lang':langConfig,
	'domain':domainConfig,
	'region':regionConfig
}

export default config;
