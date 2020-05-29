import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from flask import jsonify
import requests, json
from datetime import datetime
from dateutil import tz
import meta_data

#DATABASE AUTHENTICATION
cred = credentials.Certificate('./gcloud_config.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://covidwire.firebaseio.com'
})

#-----------------------

api_keys=json.load(open('./apis_config.json'))
db_root = db.reference('/feed')



def get_table(base,table_name,filter=False,offset=False):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	if filter:url=url+'?filterByFormula=NOT({Exported})'
	if offset:url=url+"?offset="+offset
	x = requests.get(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]})

	if "offset" in x.json():
		return x.json()["records"]+get_table(base,table_name,filter,offset=x.json()["offset"])
	return x.json()["records"]


def get_meta(state_dict):

	lang_dict={}
	for state in state_dict:
		for lang in state_dict[state]:
			if lang in lang_dict:lang_dict[lang].append(state)
			else: lang_dict[lang]=[state]

	state_list=[i[0] for i in state_dict.items()]
	lang_list=[i[0] for i in lang_dict.items()]

	return {
		'state_dict':state_dict,
		'lang_dict':lang_dict,
		'state_list':state_list,
		'lang_list':lang_list,
		'common_list':['Global','National'],
		'region_list':state_list+['Global','National']
	}


def get_time(format="iso"):
	utc=datetime.now()
	itc=utc.astimezone(tz.gettz('ITC'))
	if not format=="iso":
		return itc.isoformat().replace('.',':').replace('T',' ').split('+')[0]
	return itc.isoformat()


def pull_master(request):
	state_list=meta['state_list']

	for state in state_list:

		date_dict={}

		all_records=get_table('v3',state)
		print(len(all_records),state)
		for record in all_records:
			status=record['fields']['Status']
			if status == "C":continue

			db_fields={
				"hash":record['fields']['ID'],
				"published_time":record['fields']['Published Time'],
				"region":record['fields']['Region'],
				"src_link":record['fields']['Source Link'],
				"src_name":record['fields']['Source Name'],
				"domain":record['fields']['Domain'],
				"digests":{
					'English':{
						'digest':record['fields']['Digest'],
						'headline':record['fields']['Headline']
					}
				}
			}

			if not status=="CD":
				lang=meta['state_dict'][state][0]
				db_fields['digests'][lang]={
					'digest':record['fields']['Digest '+lang],
					'headline':record['fields']['Headline '+lang]
				}


			date=record['fields']['Published Time'].split('T')[0]
			if date in date_dict:
				date_dict[date][record['fields']['ID']]=db_fields
			else:
				date_dict[date]={record['fields']['ID']:db_fields}


#########################################
		all_records=get_table('v3','Global')
		print(len(all_records),state)
		for record in all_records:
			status=record['fields']['Status']
			if status == "C":continue

			db_fields={
				"hash":record['fields']['ID'],
				"published_time":record['fields']['Published Time'],
				"region":record['fields']['Region'],
				"src_link":record['fields']['Source Link'],
				"src_name":record['fields']['Source Name'],
				"domain":record['fields']['Domain'],
				"digests":{
					'English':{
						'digest':record['fields']['Digest'],
						'headline':record['fields']['Headline']
					}
				}
			}

			if not status=="CD":
				lang=meta['state_dict'][state][0]
				if not record['fields']['Translator '+lang]=="AUTO TRANSLATE":
					db_fields['digests'][lang]={
						'digest':record['fields']['Digest '+lang],
						'headline':record['fields']['Headline '+lang]
					}


			date=record['fields']['Published Time'].split('T')[0]
			if date in date_dict:
				date_dict[date][record['fields']['ID']]=db_fields
			else:
				date_dict[date]={record['fields']['ID']:db_fields}
	#############################
		all_records=get_table('v3','National')
		print(len(all_records),state)
		for record in all_records:
			status=record['fields']['Status']
			if status == "C":continue

			db_fields={
				"hash":record['fields']['ID'],
				"published_time":record['fields']['Published Time'],
				"region":record['fields']['Region'],
				"src_link":record['fields']['Source Link'],
				"src_name":record['fields']['Source Name'],
				"domain":record['fields']['Domain'],
				"digests":{
					'English':{
						'digest':record['fields']['Digest'],
						'headline':record['fields']['Headline']
					}
				}
			}

			if not status=="CD":
				lang=meta['state_dict'][state][0]
				if not record['fields']['Translator '+lang]=="AUTO TRANSLATE":
					db_fields['digests'][lang]={
						'digest':record['fields']['Digest '+lang],
						'headline':record['fields']['Headline '+lang]
					}


			date=record['fields']['Published Time'].split('T')[0]
			if date in date_dict:
				date_dict[date][record['fields']['ID']]=db_fields
			else:
				date_dict[date]={record['fields']['ID']:db_fields}

		db_root.child(state).update(date_dict)



def update_table(base,table_name,data):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	x = requests.patch(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]},json=data)



def shorten_url(url):
	x=requests.post("https://api-ssl.bitly.com/v4/shorten",headers={"Authorization": "Bearer "+apis_config["bitly_key"]},json={"long_url":url})
	return x.json()['link']


def update_shortlink():
	state_list=meta['state_list']

	for state in state_list:
		all_records=get_table('master',state)
		for record in all_records:
			update_list=[]
			update_list.append({
				'id':record['id'],
				'fields':{
					'Short Link':shorten_url(record['fields']['Source Link'])
				}

			})
			update_table('master',state,{"records":update_list})


#'https://covidwire.in/s'+record['fields']['ID'],
meta=get_meta(meta_data.state_dict)
