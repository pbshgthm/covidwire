import requests
from states_meta import *

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


cred = credentials.Certificate('firebase-admin-cred.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://covidwire.firebaseio.com'
})


db_stats = db.reference('/stats')

def v4_covid_stats(req):

	url="https://api.covid19india.org/v4/timeseries.json"
	data=requests.get(url).json()
	all_stats={}
	for state in state_dict:
		state_raw=data[state_dict[state]]["dates"]
		state_raw=[[date, data] for date, data in state_raw.items()]
		latest=sorted(state_raw, key = lambda x: x[0])[-1]

		delta=latest[1]['delta']
		total=latest[1]['total']

		stats={
			'date':latest[0],
			'today':{
				'confirmed':delta['confirmed'],
				'recovered':delta['recovered'],
				'deceased':delta['deceased'],
			},
			'total':{
				'active':total['confirmed']-total['recovered']-total['deceased'],
				'recovered':total['recovered'],
				'deceased':total['deceased'],
			}
		}

		all_stats[state]=stats

	db_stats.set(all_stats)


#gcloud functions deploy v4_covid_stats --runtime python37 --trigger-http --allow-unauthenticated
