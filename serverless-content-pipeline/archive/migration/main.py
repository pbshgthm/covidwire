import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from flask import jsonify
import requests, json
from datetime import datetime
from dateutil import tz
from bs4 import BeautifulSoup
import meta_data
from google_translate import translate_text


api_keys=json.load(open('./apis_config.json'))

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


def add_to_table(base,table_name,record_list):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name

	batch_split=split_list(record_list,10)
	for batch in batch_split:
		data={
				"records":batch,
				"typecast": True
		}
		x = requests.post(url,headers = {
		"Authorization": "Bearer "+api_keys["airtable_key"]},json=data)


def update_table(base,table_name,data):
	url="https://api.airtable.com/v0/"+api_keys["airtable_base_"+base]+"/"+table_name
	x = requests.patch(url,headers = {"Authorization": "Bearer "+api_keys["airtable_key"]},json=data)
	print(x.json())



def safe_dict(dict_,key):
	if key in dict_:return dict_[key]
	return ""



global_dict={}
national_dict={}


upgrade={
	'Global'		:{},
	'National'		:{},
	'Delhi'			:{},
	'Maharashtra'	:{},
	'Andhra Pradesh':{}
}

lang_dict={
	'Delhi':'Hindi',
	'Maharashtra':'Marathi',
	'Andhra Pradesh':'Telugu'
}

lang_list=['Hindi','Marathi','Telugu']



def translate_fake(text,lang):
	return lang+'  '+text+'  '+lang



'''
state_list=['Delhi','Maharashtra','Andhra Pradesh']
for state in state_list:
	table=get_table('v3',state)
	for record in table:
		fields=record['fields']

		if safe_dict(fields,'Status')=='Digestion Pending':continue

		print(state,safe_dict(fields,'ID'))

		new_dict={
			'ID': safe_dict(fields,'ID'),
			'Region':safe_dict(fields,'Region'),
			'Domain':safe_dict(fields,'Domain'),
			'Published Time':safe_dict(fields,'Published Time'),
			'Source Link':safe_dict(fields,'Source Link'),
			'Source Name':safe_dict(fields,'Source Name'),
			'Curated By':safe_dict(fields,'Curated By'),
			'Headline':safe_dict(fields,'Headline'),
			'Digest':safe_dict(fields,'Digest'),
			'Preview Image':safe_dict(fields,'Preview Image'),
			'Image Approval':safe_dict(fields,'Image Approval'),
			'Digested By':safe_dict(fields,'Digested By'),
			'Validated By':safe_dict(fields,'Validated By'),
			'DB Status':'Idle'
		}

		if new_dict["Preview Image"]=="":new_dict["Image Approval"]="Reject"

		region=safe_dict(fields,'Region')
		id=safe_dict(fields,'ID')
		lang=lang_dict[state]

		if region in lang_dict:
			for l in lang_list:
				if l==lang:
					if not safe_dict(fields,'Digest Translation')=="":
						new_dict['Digest'+' '+l]=safe_dict(fields,'Digest Translation')
						new_dict['Headline'+' '+l]=safe_dict(fields,'Headline Translation')
						new_dict['Translator'+' '+l]=safe_dict(fields,'Translation By')
						continue

				try:
					new_dict['Digest'+' '+l] = translate_text(safe_dict(fields,'Digest'),l)
					new_dict['Headline'+' '+l]= translate_text(safe_dict(fields,'Headline'),l)
					new_dict['Translator'+' '+l]="AUTO TRANSLATE"

				except Exception as e:
					raise

			upgrade[region][id]=new_dict

		else:
			if not id in upgrade[region]:
				for l in lang_list:
					if l==lang:
						if not safe_dict(fields,'Digest Translation')=="":
							new_dict['Digest'+' '+l]=safe_dict(fields,'Digest Translation')
							new_dict['Headline'+' '+l]=safe_dict(fields,'Headline Translation')
							new_dict['Translator'+' '+l]=safe_dict(fields,'Translation By')
							continue

					new_dict['Digest'+' '+l] = translate_text(safe_dict(fields,'Digest'),l)
					new_dict['Headline'+' '+l]= translate_text(safe_dict(fields,'Headline'),l)
					new_dict['Translator'+' '+l]="AUTO TRANSLATE"

				upgrade[region][id]=new_dict
			else:
				if not safe_dict(fields,'Digest Translation')=="":
					upgrade[region][id]['Digest'+' '+lang]=safe_dict(fields,'Digest Translation')
					upgrade[region][id]['Headline'+' '+lang]=safe_dict(fields,'Headline Translation')
					upgrade[region][id]['Translator'+' '+lang]=safe_dict(fields,'Translation By')





#open('tadaa.json','w',encoding='utf8').write(json.dumps(upgrade,indent=4,ensure_ascii=False))


for i in upgrade:
	print('Migrating ',i)
	add_to_table('v3',i+' New',[{'fields':upgrade[i][k]} for k in upgrade[i]])

'''


v3={}
region_list=['Delhi','Maharashtra','Andhra Pradesh','Global','National']
for r in region_list:
	records=get_table('v3',r+' New')
	v3[r]={}
	for record in records:

		fields=record['fields']
		del fields['Status']
		del fields['Age in Days']
		del fields["Auto-count"]

		v3[r][fields['ID']]=fields


open('v3-1.json','w',encoding='utf8').write(json.dumps(v3,indent=4,ensure_ascii=False))

#'''
state_list=['Delhi','Maharashtra','Andhra Pradesh']
for state in state_list:
	records=get_table('master',state)
	for record in records:
		fields=record['fields']

		region=safe_dict(fields,'Region')
		lang=lang_dict[state]
		id=safe_dict(fields,'ID')

		if id in v3[region]:
			if v3[region][id]['Translator'+' '+lang]=='AUTO TRANSLATE':
				if not safe_dict(fields,'Translation By')=="":
					print(region, state, id)
					v3[region][id]['Digest'+' '+lang]=safe_dict(fields,'Digest Translation')
					v3[region][id]['Headline'+' '+lang]=safe_dict(fields,'Headline Translation')
					v3[region][id]['Translator'+' '+lang]=safe_dict(fields,'Translation By')

		else:
			new_dict={
				'ID': safe_dict(fields,'ID'),
				'Region':safe_dict(fields,'Region'),
				'Domain':safe_dict(fields,'Domain'),
				'Published Time':safe_dict(fields,'Published Time'),
				'Source Link':safe_dict(fields,'Source Link'),
				'Source Name':safe_dict(fields,'Source Name'),
				'Curated By':safe_dict(fields,'Curated By'),
				'Headline':safe_dict(fields,'Headline'),
				'Digest':safe_dict(fields,'Digest'),
				'Preview Image':safe_dict(fields,'Preview Image'),
				'Image Approval':safe_dict(fields,'Image Approval'),
				'Digested By':safe_dict(fields,'Digested By'),
				'Validated By':safe_dict(fields,'Validated By'),
				'DB Status':'Idle'
			}

			if new_dict["Preview Image"]=="":new_dict["Image Approval"]="Reject"


			if new_dict['Digest']=="":
				for l in lang_list:
					new_dict['Digest'+' '+l]=""
					new_dict['Headline'+' '+l]=""
					new_dict['Translator'+' '+l]=""
				v3[region][id]=new_dict
				continue

			if region in lang_dict:
				for l in lang_list:
					if l==lang:
						if not safe_dict(fields,'Digest Translation')=="":
							new_dict['Digest'+' '+l]=safe_dict(fields,'Digest Translation')
							new_dict['Headline'+' '+l]=safe_dict(fields,'Headline Translation')
							new_dict['Translator'+' '+l]=safe_dict(fields,'Translation By')
							continue

					try:
						new_dict['Digest'+' '+l]=translate_text(safe_dict(fields,'Digest'),l)
						new_dict['Headline'+' '+l]=translate_text(safe_dict(fields,'Headline'),l)
						new_dict['Translator'+' '+l]="AUTO TRANSLATE"

					except Exception as e:
						raise

				v3[region][id]=new_dict

			else:
				if not id in upgrade[region]:
					for l in lang_list:
						if l==lang:
							if not safe_dict(fields,'Digest Translation')=="":
								new_dict['Digest'+' '+l]=safe_dict(fields,'Digest Translation')
								new_dict['Headline'+' '+l]=safe_dict(fields,'Headline Translation')
								new_dict['Translator'+' '+l]=safe_dict(fields,'Translation By')
								continue

						new_dict['Digest'+' '+l] = translate_text(safe_dict(fields,'Digest'),l)
						new_dict['Headline'+' '+l]= translate_text(safe_dict(fields,'Headline'),l)
						new_dict['Translator'+' '+l]="AUTO TRANSLATE"

					v3[region][id]=new_dict
				else:
					if not safe_dict(fields,'Digest Translation')=="":
						v3[region][id]['Digest'+' '+lang]=safe_dict(fields,'Digest Translation')
						v3[region][id]['Headline'+' '+lang]=safe_dict(fields,'Headline Translation')
						v3[region][id]['Translator'+' '+lang]=safe_dict(fields,'Translation By')







for i in upgrade:
	print('Updating ',i)
	add_to_table('v3',i,[{'fields':v3[i][k]} for k in v3[i]])

open('v3.json','w',encoding='utf8').write(json.dumps(v3,indent=4,ensure_ascii=False))



#export GOOGLE_APPLICATION_CREDENTIALS="./translate_keys.json"

'''

print('Delhi')

table=get_table('master','Delhi')
a=[i['fields']['ID'] for i in table]
a.sort()

for i in range(1,len(a)):
	if a[i-1]==a[i]:print(a[i])

print('Maharashtra')

table=get_table('master','Maharashtra')
a=[i['fields']['ID'] for i in table]
a.sort()
for i in range(1,len(a)):
	if a[i-1]==a[i]:print(a[i])

print('Andhra Pradesh')

table=get_table('master','Andhra Pradesh')
a=[i['fields']['ID'] for i in table]
a.sort()
for i in range(1,len(a)):
	if a[i-1]==a[i]:print(a[i])


#'''
