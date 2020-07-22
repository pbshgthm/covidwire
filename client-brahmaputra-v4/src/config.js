const stateConfig={
	'Andhra Pradesh':['Telugu','English'],
	'Delhi':['Hindi','English'],
	'Kerala':['Malayalam','English'],
	'Maharashtra':['Marathi','English'],
	'Telangana':['Telugu','English'],
	'Tamil Nadu':['Tamil','English']
}

const langConfig={
	'Hindi':{
		'native':'हिन्दी',
		'glyph':'अ'
	},
	'Malayalam':{
		'native':'മലയാളം',
		'glyph':'അ'
	},
	'Marathi':{
		'native':'मराठी',
		'glyph':'ळ'
	},
	'Telugu':{
		'native':'తెలుగు',
		'glyph':'ఆ'
	},
	'Tamil':{
		'native':'தமிழ்',
		'glyph':'அ'
	},
	'English':{
		'native':'English',
		'glyph':'A'
	}
}

const domainConfig=["Healthcare", "Society", "Administration",  "Politics", "Economy", "Legal",  "Science", "Environment", "Sports","Others"]

const regionConfig=["Global","National","Andhra Pradesh","Delhi","Kerala","Maharashtra","Telangana","Tamil Nadu"]


const config={
	'state':stateConfig,
	'lang':langConfig,
	'domain':domainConfig,
	'region':regionConfig
}

export default config;
