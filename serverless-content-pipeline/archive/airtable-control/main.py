import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from flask import jsonify
import requests, json
from datetime import datetime
from dateutil import tz
from bs4 import BeautifulSoup
import meta_data
import google_translate

#DATABASE AUTHENTICATION
cred = credentials.Certificate('./gcloud_config.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://covidwire.firebaseio.com'
})

#-----------------------

api_keys=json.load(open('./apis_config.json'))
db_time = db.reference('/progress')

#GET TABLE FROM AIRTABLE
def get_table(base,table_name,filter=False,offset=False):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	if filter:url=url+'?filterByFormula=AND(NOT({Exported}),{Status}="Completed")'
	if offset:url=url+"?offset="+offset
	x = requests.get(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]})
	#print(x.json(),table_name)
	if "offset" in x.json():
		return x.json()["records"]+get_table(base,table_name,filter,offset=x.json()["offset"])
	return x.json()["records"]

#-----------------------

def add_to_table(base,table_name,data):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	x = requests.post(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]},json=data)
	#print(x.json())

def update_table(base,table_name,data):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	x = requests.patch(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]},json=data)
	#print(x.json())



def get_preview_img(url):
	try:
		response = requests.get(url)
		soup = BeautifulSoup(response.text,features="lxml")
		metas = soup.find_all('meta')
		imgs=[]
		for i in metas:
			if "property" in i.attrs:
				if i["property"]=="og:image":imgs.append(i["content"])
		if len(imgs)==0:print(url,'Preview image not found')
		return imgs[0]
	except Exception as e:
		print(e,url)
		return ""

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

def get_time(format="iso"):
	utc=datetime.now()
	itc=utc.astimezone(tz.gettz('ITC'))
	if not format=="iso":
		return itc.isoformat().replace('.',':').replace('T',' ').split('+')[0]
	return itc.isoformat()

def shorten_url(url):
	x=requests.post("https://api-ssl.bitly.com/v4/shorten",headers={"Authorization": "Bearer "+api_keys["bitly_key"]},json={"long_url":url})
	return x.json()['link']


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
		'lang_list':lang_list
	}



def pull_curation():
	print('pulling curation...')
	activity={}

	records=get_table('a','Curation',filter=True)

	digest_records=[]
	mark_export=[]
	master_tables={k:[] for k in meta['state_list']}


	for record in records:
		curation_fields=record['fields']
		if 'Exported' in curation_fields:continue

		mandate_fields=['Region','Domain','Published Time','Source Link','Source Name','Curated By']
		if not all(field in curation_fields for field in mandate_fields):
			continue

		try:
			hash=link_hash(curation_fields['Source Link'])
		except Exception as e:
			continue
			#URL INVALIDATE RESPONSE ??

		if 'Remarks' in curation_fields:
			remarks=curation_fields["Remarks"]
		else: remarks=""

		p_img=get_preview_img(curation_fields['Source Link'].split('?')[0])

		#UPDATE MASTER BASE
		master_fields={
			'ID':hash,
			'Published Time':curation_fields['Published Time'],
			'Source Name':curation_fields['Source Name'],
			'Source Link':curation_fields['Source Link'].split('?')[0],
			'Short Link':shorten_url(curation_fields['Source Link']),
			'Domain':curation_fields['Domain'],
			'Region':curation_fields['Region'],
			'Curated By':curation_fields['Curated By'],
			'Status':'Digestion Pending',
			'Preview Image':p_img
		}

		if curation_fields['Region'] in ['Global','National']:
			state_list=meta['state_list'][:]
		else: state_list=[curation_fields['Region']]

		for state in state_list:
			master_tables[state].append({"fields":master_fields})

		activity[get_time("formated")]={
				'activity' :'curation',
				'timestamp':get_time(),
				'author'   :curation_fields['Curated By'],
				'region'   :curation_fields['Region'],
				'domain'   :curation_fields['Domain'],
				'id'	   :hash
		}


		# ADD TO DIGESTION UPDATE LIST
		digest_fields={
			'ID-val':hash,
			'Published Time-val':curation_fields['Published Time'],
			'Region-val':curation_fields['Region'],
			'Domain-val':curation_fields['Domain'],
			'Source Link-val':curation_fields['Source Link'].split('?')[0],
			'Remarks-val': remarks,
			'Preview Image-val':p_img
		}
		digest_records.append({"fields":digest_fields})

		# UPDATE CURATION TABLE
		mark_export.append({
			"id":record['id'],
			"fields":{"Exported":True,"ID-val":hash}
		})


	for state in master_tables:
		if not len(master_tables[state])==0:
			print('Adding curation - '+state+' ('+str(len(master_tables[state]))+')')
			add_to_table("master",state,{
				"records":master_tables[state],
				"typecast": True
			})
			#pass

	if not len(digest_records)==0:
		add_to_table('a','Digestion',{"records":digest_records})
		#pass
	if not len(mark_export)==0:
		update_table('a','Curation',{"records":mark_export})
		#pass
	if not activity=={}:
		db_time.child(get_time().split('T')[0]).update(activity)
		#pass

def pull_digestion():
	global hash_dict
	activity={}
	print('pulling digestion...')
	records=get_table('a','Digestion',filter=True)

	mark_export=[]
	mark_status=[]

	lang_tables={k:[] for k in meta['lang_list']}
	master_tables={k:[] for k in meta['state_list']}

	for record in records:
		digestion_fields=record['fields']

		if 'Exported' in digestion_fields:continue

		mandate_fields=['ID','Region','Headline','Digest','Source Link','Digested By','Validated By']
		if not all(field in digestion_fields for field in mandate_fields):
			continue

		if digestion_fields['Validated By']=="FLAG RED":continue

		region=digestion_fields['Region']
		img_approval=""
		if "Image Approval" in digestion_fields:
			img_approval=digestion_fields["Image Approval"]

		# UDPATE MASTER BASE
		master_fields={
			'Digest':digestion_fields['Digest'],
			'Digested By':digestion_fields['Digested By'],
			'Validated By':digestion_fields['Validated By'],
			'Headline':digestion_fields['Headline'],
			'Status':'Translation Pending',
			'Image Approval':img_approval
		}

		if region in ['Global','National']:
			state_list=meta['state_list'][:]
		else: state_list=[region]

		for state in state_list:
			try:
				master_tables[state].append({
					"id":hash_dict[state][digestion_fields["ID"]],
					"fields":master_fields
				})
			except Exception as e:
				print(e,digestion_fields["ID"],state)
				continue


		activity[get_time("formated")]={
				'activity'  :'digestion',
				'timestamp' :get_time(),
				'author'    :digestion_fields['Digested By'],
				'region'    :digestion_fields['Region'],
				'validation':digestion_fields['Validated By'],
				'id'	    :digestion_fields['ID']
		}


		# MARK DIGESTION BASE
		mark_export.append({
			"id":record['id'],
			"fields":{"Exported":True}
		})


		#TO TRANSLATION
		translation_fields={
			'ID-val':digestion_fields['ID'],
			'Region-val':digestion_fields['Region'],
			'Source Link-val':digestion_fields['Source Link'],
			'Digest-val':digestion_fields['Digest'],
			'Headline-val':digestion_fields['Headline']
		}
		if 'Published Time' in digestion_fields:
			translation_fields['Published Time-val']=digestion_fields['Published Time']

		if region in ['Global','National']:
			lang=[i[0] for i in meta['lang_dict'].items()]
		else:
			lang=meta['state_dict'][region]

		for i in lang:
			auto_translated_text=google_translate.translate_text(digestion_fields['Digest'],i)
			translation_fields_auto=dict(translation_fields)
			translation_fields_auto['Digest Auto-Translate-val']=auto_translated_text
			lang_tables[i].append({"fields":translation_fields_auto})


	for state in master_tables:
		if not len(master_tables[state])==0:
			print('Updating Digestion - '+state+' ('+str(len(master_tables[state]))+')')
			batch=split_list(master_tables[state],10)
			for j in batch:
				update_table("master",state,{
					"records":j,
					"typecast": True
				})
				#pass

	for i in lang_tables:
		if not len(lang_tables[i])==0:
			batch=split_list(lang_tables[i],10)
			for j in batch:
				add_to_table('b',i,{'records':j})
				#pass
	if not len(mark_export)==0:
		batch=split_list(mark_export,10)
		for j in batch:
			update_table('a','Digestion',{"records":j})
			#pass
	if not activity=={}:
		db_time.child(get_time().split('T')[0]).update(activity)
		#pass

def pull_translation():
	global hash_dict
	activity={}
	print("pulling translation...")
	lang_list=meta['lang_list'][:]
	master_tables={k:[] for k in meta['state_list']}

	for lang in lang_list:
		records=get_table('b',lang,filter=True)
		mark_export=[]

		for record in records:
			translation_fields=record['fields']

			if 'Exported' in translation_fields:continue

			mandate_fields=['ID','Headline Translation','Digest Translation','Translated By','Region']
			if not all(field in translation_fields for field in mandate_fields):
				continue

			region=translation_fields["Region"]

			master_fields={
				'Digest Translation':translation_fields['Digest Translation'],
				'Headline Translation':translation_fields['Headline Translation'],
				'Translation By':translation_fields['Translated By'],
				'Status':'Completed'
			}

			if region in ['Global','National']:
				state_list=meta['lang_dict'][lang]
			else:state_list=[region]
			for state in state_list:
				try:
					master_tables[state].append({
						"id":hash_dict[state][translation_fields["ID"]],
						"fields":master_fields
					})
				except Exception as e:
					print(e,translation_fields["ID"],state)
					continue

			activity[get_time("formated")]={
					'activity'  :'translation',
					'timestamp' :get_time(),
					'author'    :translation_fields['Translated By'],
					'region'    :translation_fields['Region'],
					'language'  :lang,
					'id'	    :translation_fields['ID']
			}

			#MARK EXPORT ON TRANSLATION
			mark_export.append({
				"id":record['id'],
				"fields":{"Exported":True}
			})


		for state in master_tables:
			if not len(master_tables[state])==0:
				print('Updating Translation - '+state+' ('+str(len(master_tables[state]))+')')
				batch=split_list(master_tables[state],10)
				for j in batch:
					update_table("master",state,{
						"records":j,
						"typecast": True
					})
					#pass

		if not len(mark_export)==0:
			batch=split_list(mark_export,10)
			for j in batch:
				update_table('b',lang,{"records":j})
				#pass

	if not activity=={}:
		db_time.child(get_time().split('T')[0]).update(activity)
		#pass

def get_hash_table():
	hash_table={}
	for state in meta['state_list']:
		table=get_table('master',state)
		hash_table[state]={}
		for record in table:
			hash_table[state][record['fields']['ID']]=record['id']
	return hash_table


def split_list(mylist, chunk_size):
	return [mylist[offs:offs+chunk_size] for offs in range(0, len(mylist), chunk_size)]


meta=get_meta(meta_data.state_dict)
hash_dict={}


def pull_data(request):
	global hash_dict
	hash_dict=get_hash_table()
	pull_curation()
	pull_digestion()
	pull_translation()
	return



#export GOOGLE_APPLICATION_CREDENTIALS="./translate_keys.json"
#gcloud functions deploy pull_data --runtime python37 --trigger-http --allow-unauthenticated

#pull_data('asa')


## MORE THAN 100 CURATED
# URL VALIDATION
# OTHER FIELDS VALIDATION
# URL SAFE VALUE FOR STATE NAMES
