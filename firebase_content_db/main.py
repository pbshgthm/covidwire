import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from flask import jsonify
import requests, json
from datetime import datetime
from dateutil import tz
import meta_data

#DATABASE AUTHENTICATION
cred = credentials.Certificate('firebase-admin-cred.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://covidwire.firebaseio.com'
})

#-----------------------

api_keys=json.load(open('./apis_config.json'))


db_feed = db.reference('/feed')
db_section = db.reference('/section')
db_hope = db.reference('/hope')
db_index = db.reference('/index')
db_corpus = db.reference('/corpus')


def get_table(base,table_name,offset=False,nofilter=False):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	if not nofilter:url=url+'?filterByFormula=NOT({Status}="C")'
	if offset:url=url+"&offset="+offset
	x = requests.get(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]})
	if "offset" in x.json():
		return x.json()["records"]+get_table(base,table_name,offset=x.json()["offset"])
	return x.json()["records"]



def get_time(format="iso"):
	utc=datetime.now()
	itc=utc.astimezone(tz.gettz('ITC'))
	if not format=="iso":
		return itc.isoformat().replace('.',':').replace('T',' ').split('+')[0]
	return itc.isoformat()



def format_entry(fields):
	formated_fields={
		"hash":fields['ID'],
		"region":fields['Region'],
		"domain":fields['Domain'],
		"time":fields['Published Time'],
		"link":fields['Source Link'],
		"src":fields['Source Name'],
		"img":safe_dict(fields,'Preview Image') if safe_dict(fields,'Image Approval')=="Approve" else "",
		"form":safe_dict(fields,'Format'),
		"digests":{
			"English":{
				"headline":fields['Headline'],
				"digest":fields['Digest'],
				"auto":False
			},
			"Hindi":{
				"headline":fields['Headline Hindi'],
				"digest":fields['Digest Hindi'],
				"auto":fields['Translator Hindi']=='AUTO TRANSLATE'
			},
			"Telugu":{
				"headline":fields['Headline Telugu'],
				"digest":fields['Digest Telugu'],
				"auto":fields['Translator Telugu']=='AUTO TRANSLATE'
			},
			"Marathi":{
				"headline":fields['Headline Marathi'],
				"digest":fields['Digest Marathi'],
				"auto":fields['Translator Marathi']=='AUTO TRANSLATE'
			},
			"Tamil":{
				"headline":safe_dict(fields,'Headline Tamil'),
				"digest":safe_dict(fields,'Digest Tamil'),
				"auto":safe_dict(fields,'Translator Tamil')=='AUTO TRANSLATE'
			},
			"Malayalam":{
				"headline":safe_dict(fields,'Headline Malayalam'),
				"digest":safe_dict(fields,'Digest Malayalam'),
				"auto":safe_dict(fields,'Translator Malayalam')=='AUTO TRANSLATE'
			}
		}
	}
	return formated_fields

def v4_update_db(request):

	index_dict={}
	corpus_dict={}

	master_table={}
	for region in meta_data.region_list:
		print('Pulling ',region)
		master_table[region]=get_table('v3',region)

	#HOPE FILLING
	hope_table=get_table('v3','Hope')
	hope_dict={}
	for record in hope_table:
		db_fields=format_entry(record['fields'])

		date=db_fields['time'].split('T')[0]
		if date in hope_dict:hope_dict[date][db_fields['hash']]=db_fields
		else:hope_dict[date]={db_fields['hash']:db_fields}
	db_hope.set(hope_dict)

	# FEED FILLING BEGIN
	for state in meta_data.state_list:
		date_dict={}
		for record in master_table[state]:
			db_fields=format_entry(record['fields'])

			date=db_fields['time'].split('T')[0]
			if date in date_dict:date_dict[date][db_fields['hash']]=db_fields
			else:date_dict[date]={db_fields['hash']:db_fields}

			#save for indexing
			corpus_dict[db_fields['hash']]={
				'hash':db_fields['hash'],
				'headline':db_fields['digests']['English']['headline'],
				'digest':db_fields['digests']['English']['digest']
			}
			index_dict[db_fields['hash']]=db_fields

		for common in meta_data.common_list:
			for record in master_table[common]:
				db_fields=format_entry(record['fields'])

				date=db_fields['time'].split('T')[0]
				if date in date_dict:date_dict[date][db_fields['hash']]=db_fields
				else:date_dict[date]={db_fields['hash']:db_fields}

			#save for indexing
				corpus_dict[db_fields['hash']]={
					'hash':db_fields['hash'],
					'headline':db_fields['digests']['English']['headline'],
					'digest':db_fields['digests']['English']['digest']
				}
				index_dict[db_fields['hash']]=db_fields

		db_feed.child(state).set(date_dict)

	date_dict={}
	for common in meta_data.common_list:
		for record in master_table[common]:
			db_fields=format_entry(record['fields'])
			date=db_fields['time'].split('T')[0]
			if date in date_dict:date_dict[date][db_fields['hash']]=db_fields
			else:date_dict[date]={db_fields['hash']:db_fields}

	db_feed.child('Common').set(date_dict)
	db_feed.child('India & World').set(date_dict)
	# FEED FILLING END

	domain_wise={
    	"Economy":{},
    	"Healthcare":{},
    	"Administration":{},
    	"Society":{},
    	"Legal":{},
    	"Politics":{},
    	"Others":{},
    	"Science":{},
    	"Environment":{},
    	"Sports":{},
    	"Education":{}
	}

	region_wise={
		"Global":{},
    	"National":{},
    	"Delhi":{},
    	"Maharashtra":{},
    	"Andhra Pradesh":{},
		"Tamil Nadu":{},
		"Kerala":{},
    	"Hope":{},
		"Telangana":{}
	}

	for region in meta_data.region_list:
		for record in master_table[region]:
			db_fields=format_entry(record['fields'])

			date=db_fields['time'].split('T')[0]

			if date in domain_wise[db_fields['domain']]:
				domain_wise[db_fields['domain']][date][db_fields['hash']]=db_fields
			else:
				domain_wise[db_fields['domain']][date]={db_fields['hash']:db_fields}

			if date in region_wise[db_fields['region']]:
				region_wise[db_fields['region']][date][db_fields['hash']]=db_fields
			else:
				region_wise[db_fields['region']][date]={db_fields['hash']:db_fields}


	for region in region_wise:
		db_section.child(region).set(region_wise[region])

	for domain in domain_wise:
		db_section.child(domain).set(domain_wise[domain])



	db_index.set(index_dict)
	db_corpus.set(corpus_dict)
	print('ALL OK')

def safe_dict(dict_,key,default=""):
	if key in dict_:return dict_[key]
	return default

def update_table(base,table_name,data):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	x = requests.patch(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]},json=data)



#v4_update_db('as')
#gcloud functions deploy v4_update_db --runtime python37 --timeout=540s --trigger-http --allow-unauthenticated
