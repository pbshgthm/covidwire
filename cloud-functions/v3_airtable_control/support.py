import json, requests
from datetime import datetime
from dateutil import tz
from bs4 import BeautifulSoup
from google.cloud import translate
from google.oauth2 import service_account

import region_data

client = translate.TranslationServiceClient()
parent = client.location_path('covidwire', "global")

def split_list(mylist, chunk_size):
	return [mylist[offs:offs+chunk_size] for offs in range(0, len(mylist), chunk_size)]


def get_table(base,table_name,filter=False,offset=False):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	if filter:url=url+'?filterByFormula=AND(NOT({Exported}),{Status}="Completed")'
	if offset:url=url+"?offset="+offset
	x = requests.get(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]})

	if "offset" in x.json():
		return x.json()["records"]+get_table(base,table_name,filter,offset=x.json()["offset"])
	return x.json()["records"]


def add_to_table(base,table_name,record_list,message=""):
	if len(record_list)==0:return
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name

	batch_split=split_list(record_list,10)
	for batch in batch_split:
		data={
				"records":batch,
				"typecast": True
		}
		x = requests.post(url,headers = {
		"Authorization": "Bearer "+api_keys["airtable_key"]},json=data)
	if not message=="":
		print('Added',message,table_name,len(record_list))


def update_table(base,table_name,record_list,message=""):
	if len(record_list)==0:return
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name

	batch_split=split_list(record_list,10)
	for batch in batch_split:
		data={
				"records":batch,
				"typecast": True
		}
		x = requests.patch(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]},json=data)

	if not message=="":
		print('Updated',message,table_name,len(record_list))


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
		print("Can't get Image Preview for",url)
		return ""


def link_hash(url):
	url=url.strip()
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


def get_meta():
	state_dict=region_data.state_dict
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
		'region_list':state_list+region_data.common_region,
		'common_region':region_data.common_region
	}

def get_hash_dict(meta):
	hash_table={}
	for region in meta['region_list']:
		table=get_table('v3',region)
		hash_table[region]={}
		for record in table:
			hash_table[region][record['fields']['ID']]=record['id']
	return hash_table


def safe_dict(dict_,key,default=""):
	if key in dict_:return dict_[key]
	return default


def translate_text(text,lang):
	if text=='':return
	lang_code={
		'Telugu':'te',
		'Hindi':'hi',
		'Marathi':'mr',
		'Tamil':'ta',
		'Malayalam':'ml'
	}

	response = client.translate_text(
		parent=parent,
		contents=[text],
		mime_type="text/plain",
		source_language_code="en-US",
		target_language_code=lang_code[lang],
		)
	for translation in response.translations:
		return translation.translated_text



api_keys=json.load(open('./apis_config.json'))


#export GOOGLE_APPLICATION_CREDENTIALS="./translate_keys.json"
#gcloud functions deploy pull_data --runtime python37 --trigger-http --allow-unauthenticated
