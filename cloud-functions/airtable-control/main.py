import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from flask import jsonify
import requests, json
from datetime import datetime
from dateutil import tz

#DATABASE AUTHENTICATION
cred = credentials.Certificate('./gcloud_config.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://covidwire.firebaseio.com'
})

#-----------------------

api_keys=json.load(open('./apis_config.json'))
db_root = db.reference('/beta2')
db_time = db.reference('/timestamp')

#GET TABLE FROM AIRTABLE
def get_table(base,table_name):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	x = requests.get(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]})
	return x.json()["records"]

#-----------------------

def add_to_table(base,table_name,data):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	x = requests.post(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]},json=data)


def update_table(base,table_name,data):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	x = requests.patch(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]},json=data)


def link_hash(url):
	dynlink_param={
    	"longDynamicLink": "https://covidwire.in/s?link="+url,
    	"suffix": {
        	"option": "SHORT"
    	}
	}

	short_link=requests.post("https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key="+api_keys["dynamic_link_key"],json=dynlink_param).json()
	hash=short_link["shortLink"].split('/')[-1]
	return hash

def get_time():
	utc=datetime.now()
	itc=utc.astimezone(tz.gettz('ITC'))
	return itc.isoformat().split('.')[0].replace('T',' ')

def get_meta():
	meta=get_table('meta','State Info')
	state_dict={}
	lang_dict={}
	for i in meta:
		fields=i["fields"]
		state=fields['State Name']
		lang=[]
		for j in range(3):
			if "Lang_"+str((j+1)) in fields:
				lang.append(fields["Lang_"+str((j+1))])

		state_dict[state]=lang

		for j in lang:
			if j in lang_dict:
				lang_dict[j].append(state)
			else:
				lang_dict[j]=[state]

	return {'state_dict':state_dict,'lang_dict':lang_dict}



def pull_curation():
	records=get_table('a','Curation')

	digest_records=[]
	mark_export=[]

	for record in records:
		curation_fields=record['fields']

		if 'Exported' in curation_fields:continue

		mandate_fields=['Region','Domain','Published Time','Source Link','Source Name','Curated By','Validated By','RecID']
		if not all(field in curation_fields for field in mandate_fields):
			continue

		hash=link_hash(curation_fields['Source Link'])
		mark_export.append({
			"id":record['id'],
			"fields":{"Exported":True,'ID-val':hash}
		})

		if 'Remarks' in curation_fields:
			remarks=curation_fields["Remarks"]
		else: remarks=""

		digest_fields={
			'ID-val':hash,
			'Region-val':curation_fields['Region'],
			'Domain-val':curation_fields['Domain'],
			'Source Link-val':curation_fields['Source Link'].split('?')[0],
			'RecID':curation_fields['RecID'],
			'Remarks-val': remarks
		}

		db_fields={
			'hash':hash,
			'rec_id':curation_fields['RecID'],
			'published_time':curation_fields['Published Time'],
			'src_name':curation_fields['Source Name'],
			'src_link':curation_fields['Source Link'].split('?')[0],
			'domain':curation_fields['Domain'],
			'region':curation_fields['Region'],
			'curated_by':curation_fields['Curated By'],
			'validated_by':curation_fields['Validated By']
		}

		digest_records.append({"fields":digest_fields})

		if curation_fields['Region'] in ['Global','National']:
			state_list=[i[0] for i in meta['state_dict'].items()]
		else: state_list=[curation_fields['Region']]

		for state in state_list:
			db_root.child(state+'/'+db_fields['hash']).update(db_fields)
			db_time.child(get_time()).set(['curation',state,db_fields['hash']])

	if not len(digest_records)==0:
		add_to_table('a','Digestion',{"records":digest_records})

	if not len(mark_export)==0:
		update_table('a','Curation',{"records":mark_export})


def pull_digestion():
	records=get_table('a','Digestion')

	mark_export=[]
	mark_status=[]

	lang_tables={k:[] for k in [i[0] for i in meta['lang_dict'].items()]}

	for record in records:
		digestion_fields=record['fields']

		if 'Exported' in digestion_fields:continue

		mandate_fields=['ID','Region','Hashtags','Digest','Source Link','Digested By','RecID']
		if not all(field in digestion_fields for field in mandate_fields):
			continue

		region=digestion_fields['Region']

		mark_export.append({
			"id":record['id'],
			"fields":{"Exported":True}
		})

		mark_status.append({
			'id':digestion_fields['RecID'],
			"fields":{"Status-val":"Completed"}
		})

		if region in ['Global','National']:
			lang=[i[0] for i in meta['lang_dict'].items()]
		else:
			lang=meta['state_dict'][region]

		translation_fields={
			'ID-val':digestion_fields['ID'],
			'Region-val':digestion_fields['Region'],
			'Source Link-val':digestion_fields['Source Link'],
			'Digest-val':digestion_fields['Digest'],
			'RecID':digestion_fields['RecID']
		}

		db_fields={
			'digest':digestion_fields['Digest'],
			'hashtags':digestion_fields['Hashtags'],
			'author':digestion_fields['Digested By']
		}

		for i in lang:
			lang_tables[i].append({"fields":translation_fields})

		if region in ['Global','National']:
			state_list=[i[0] for i in meta['state_dict'].items()]
		else: state_list=[region]

		for state in state_list:
			db_root.child(state+'/'+digestion_fields['ID']+'/digests').update({"english":db_fields})
			db_time.child(get_time()).set(['digestion',state,digestion_fields['ID']])


	for i in lang_tables:
		add_to_table('b',i,{'records':lang_tables[i]})

	if not len(mark_export)==0:
		update_table('a','Digestion',{"records":mark_export})

	if not len(mark_status)==0:
		update_table('a','Curation',{"records":mark_status})


def pull_translation():

	lang_list=[i[0] for i in meta['lang_dict'].items()]
	for lang in lang_list:
		records=get_table('b',lang)
		mark_export=[]

		for record in records:
			translation_fields=record['fields']

			if 'Exported' in translation_fields:continue

			mandate_fields=['ID','Translation','Translated By','RecID','Region']
			if not all(field in translation_fields for field in mandate_fields):
				continue

			region=translation_fields["Region"]
			mark_export.append({
				"id":record['id'],
				"fields":{"Exported":True}
			})

			db_fields={
				'digest':translation_fields['Translation'],
				'author':translation_fields['Translated By']
			}

			if region in ['Global','National']:
				state_list=meta['lang_dict'][lang]
			else:
				state_list=[region]
			print(state_list)
			for state in state_list:
				db_root.child(state+'/'+translation_fields['ID']+'/digests').update({lang.lower():db_fields})
				db_time.child(get_time()).set(['translation-'+lang,state,translation_fields['ID']])

		if not len(mark_export)==0:
			update_table('b',lang,{"records":mark_export})



meta=get_meta()

def pull_data(request):
	pull_curation()
	pull_digestion()
	pull_translation()
	return


# URL VALIDATION
# OTHER FIELDS VALIDATION
