import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from flask import jsonify
import requests, json
from datetime import datetime

#Database Authorization
cred = credentials.Certificate('./gcloud_config.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://covidwire.firebaseio.com'
})

api_keys=json.load(open('./apis_config.json'))

db_root = db.reference('/')

#Get table from Airtable
def fetch_table(table_name,meta=False):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_b"]+"/"+table_name
	if(meta):
		url="https://api.airtable.com/v0/"+api_keys["airtable_base_m"]+"/State%20Info"

	x = requests.get(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]})
	return x.json()["records"]


#Get meta table from airtable and update DB
def update_meta_data():
	meta=fetch_table("State Info",meta=True)

	meta_data={}
	for i in meta:
		state=i["fields"]
		state_data={
			'name':state['State Name'],
			'type':state["Type"],
		}
		lang=["English"]
		for i in range(3):
			if "Lang_"+str((i+1)) in state:
				lang.append(state["Lang_"+str((i+1))])

		state_data["lang"]=lang
		state_ind=state["State Name"].replace(" & ",'-').replace(" ",'-').lower()
		meta_data[state_ind]=state_data

	db_root.child('meta').set(meta_data)
	return "Updated Meta"


def format_digest(raw,lang):
	digest={}
	digest['region']=raw['Region']
	digest['time']=raw['Published Time'][:-5]
	digest['src_name']=raw['Source Name']
	digest['src_link']=raw['Source']
	digest['lang']=lang

	dynlink_param={
    	"longDynamicLink": "https://covidwire.in/s?link="+digest["src_link"],
    	"suffix": {
        	"option": "SHORT"
    	}
	}

	short_link=requests.post("https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key="+api_keys["dynamic_link_key"],json=dynlink_param).json()
	digest["src_dynlink"]=short_link["shortLink"]

	digest_content=[]
	for i in range(len(lang)):
		lang_digest={}
		#lang_digest['topic']=raw['Hashtags_'+str(i+1)]
		lang_digest['topic']=['topic_1','topic_2']
		lang_digest['body']=raw['Digest_'+str(i+1)]
		digest_content.append(lang_digest)

	digest['content']=digest_content
	return digest


def fetch_general():
	general_data=fetch_table("General")
	digest_list=[]

	for record in general_data:
		try:
			digest=format_digest(record['fields'],['English','Hindi'])
		except Exception as e:
			print("Incomplete",e)
			return

		digest_list.append(digest)
	digest_list.sort(key = lambda x:-datetime.fromisoformat(x['time']).timestamp())
	return digest_list



def update_general():
	general_digest=fetch_general()
	db_root.child('general').set(general_digest)
	return "Updated general"


def update_state(state):
	state_name=state["name"]
	state_type=state["type"]
	state_lang=state["lang"]

	if state_type=="Empty":return

	state_data=fetch_table(state_name)
	digest_list=[]

	for record in state_data:
		try:
			digest=format_digest(record['fields'],state_lang)
		except Exception as e:
			print("Incomplete",e)
			return

		digest_list.append(digest)

	if state_type == "Hindi":
		digest_list.extend(db_root.child('general').get())


	digest_list.sort(key = lambda x:-datetime.fromisoformat(x['time']).timestamp())

	state_ind=state_name.replace(" & ",'-').replace(" ",'-').lower()
	db_root.child('states/'+state_ind).set(digest_list)

	return "Updated "+state_name



def db_update(request):
	param = request.get_json(silent=True)

	type=param["type"]
	if(type=="meta"):
		return update_meta_data()

	meta=db_root.child('meta').get()
	if(type=="general"):
		return update_general()
	if(type=="state"):
		state_name=param['state']
		state_name=state_name.replace(" & ",'-').replace(" ",'-').lower()
		print(state_name)
		if state_name in meta:
			return update_state(meta[state_name])
		return "Invalid State"
	return "Invalid Params"
