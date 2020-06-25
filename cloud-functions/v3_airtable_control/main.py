import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


from support import *

#DATABASE AUTHENTICATION
cred = credentials.Certificate('./gcloud_config.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://covidwire.firebaseio.com'
})


db_time = db.reference('/progress')


def pull_curation():
	global meta
	print('pulling curation...')
	activity={}
	digestion_records=[]
	mark_export=[]
	master_tables={k:[] for k in meta['region_list']}
	records=get_table('a','Curation',filter=True)

	for record in records:
		curation_fields=record['fields']
		try:hash=link_hash(curation_fields['Source Link'])
		except Exception as e:
			print(e)
			continue

		p_img=get_preview_img(curation_fields['Source Link'].split('?')[0])

		#UPDATE MASTER BASE
		master_fields={
			'ID':hash,
			'Published Time':curation_fields['Published Time'],
			'Source Name':curation_fields['Source Name'],
			'Source Link':curation_fields['Source Link'].split('?')[0],
			'Domain':curation_fields['Domain'],
			'Region':curation_fields['Region'],
			'Curated By':curation_fields['Curated By'],
			'Preview Image':p_img,
			'DB Status':'Idle'
		}
		master_tables[curation_fields['Region']].append({"fields":master_fields})


		# ADD TO DIGESTION UPDATE LIST
		digestion_fields={
			'ID-val':hash,
			'Published Time-val':curation_fields['Published Time'],
			'Region-val':curation_fields['Region'],
			'Domain-val':curation_fields['Domain'],
			'Source Link-val':curation_fields['Source Link'].split('?')[0],
			'Remarks-val': safe_dict(curation_fields,'Remarks'),
			'Preview Image-val':p_img
		}
		digestion_records.append({"fields":digestion_fields})

		#UPDATE ACTIVITY
		activity[get_time("formated")]={
				'activity' :'curation',
				'timestamp':get_time(),
				'author'   :curation_fields['Curated By'],
				'region'   :curation_fields['Region'],
				'domain'   :curation_fields['Domain'],
				'id'	   :hash
		}

		# UPDATE CURATION TABLE
		mark_export.append({
			"id":record['id'],
			"fields":{"Exported":True,"ID-val":hash}
		})

	for region in master_tables:
		add_to_table("v3",region,master_tables[region],message="Curation")

	add_to_table('a','Digestion',digestion_records)
	update_table('a','Curation',mark_export)


	if not activity=={}:
		db_time.child(get_time().split('T')[0]).update(activity)


def pull_digestion():
	global hash_dict
	global meta

	activity={}
	print('pulling digestion...')
	records=get_table('a','Digestion',filter=True)

	mark_export=[]
	lang_tables={k:[] for k in meta['lang_list']}
	master_tables={k:[] for k in meta['region_list']}

	for record in records:
		digestion_fields=record['fields']
		region=digestion_fields['Region']

		if not digestion_fields["ID"] in hash_dict[region]:
			print('Digestion Record not found in Master ',digestion_fields["ID"])
			continue


		# UDPATE MASTER BASE
		master_fields={
			'Headline':digestion_fields['Headline'],
			'Digest':digestion_fields['Digest'],
			'Digested By':digestion_fields['Digested By'],
			'Validated By':digestion_fields['Validated By'],
			'Image Approval':digestion_fields["Image Approval"],
			'Format':safe_dict(digestion_fields,"Format")
		}

		auto_trans={}
		for lang in meta['lang_list']:
			auto_trans[lang]={
				'Digest':translate_text(digestion_fields['Digest'],lang),
				'Headline':translate_text(digestion_fields['Headline'],lang)
			}
			master_fields['Digest '+lang]=auto_trans[lang]['Digest']
			master_fields['Headline '+lang]=auto_trans[lang]['Headline']
			master_fields['Translator '+lang]='AUTO TRANSLATE'

		master_tables[region].append({
			"id":hash_dict[region][digestion_fields["ID"]],
			"fields":master_fields
		})

		activity[get_time("formated")]={
				'activity'  :'digestion',
				'timestamp' :get_time(),
				'author'    :digestion_fields['Digested By'],
				'region'    :digestion_fields['Region'],
				'validation':digestion_fields['Validated By'],
				'id'	    :digestion_fields['ID']
		}


		#TO TRANSLATION
		translation_fields={
			'ID-val':digestion_fields['ID'],
			'Region-val':digestion_fields['Region'],
			'Source Link-val':digestion_fields['Source Link'],
			'Digest-val':digestion_fields['Digest'],
			'Headline-val':digestion_fields['Headline'],
			'Published Time-val':digestion_fields['Published Time']
		}

		if region in meta['common_region']:lang_list=meta['lang_list']
		else:lang_list=meta['state_dict'][region]

		for lang in lang_list:
			translation_fields_auto=dict(translation_fields)
			translation_fields_auto['Digest Auto-Translate-val']=auto_trans[lang]['Digest']
			lang_tables[lang].append({"fields":translation_fields_auto})

		# MARK DIGESTION BASE
		mark_export.append({
			"id":record['id'],
			"fields":{"Exported":True}
		})


	for region in master_tables:
		update_table("v3",region,master_tables[region],"Digestion")

	for lang in lang_tables:
		add_to_table('b',lang,lang_tables[lang])

	update_table('a','Digestion',mark_export)

	if not activity=={}:
		db_time.child(get_time().split('T')[0]).update(activity)


def pull_translation():
	global hash_dict
	activity={}
	print("pulling translation...")
	lang_list=meta['lang_list']


	for lang in lang_list:
		master_tables={k:[] for k in meta['region_list']}
		records=get_table('b',lang,filter=True)
		mark_export=[]

		for record in records:
			translation_fields=record['fields']
			region=translation_fields['Region']

			if not translation_fields["ID"] in hash_dict[region]:
				print('Translation Record not found in Master ',lang,digestion_fields["ID"])
				continue

			master_fields={
				'Digest '+lang:translation_fields['Digest Translation'],
				'Headline '+lang:translation_fields['Headline Translation'],
				'Translator '+lang:translation_fields['Translated By'],
			}


			master_tables[region].append({
				"id":hash_dict[region][translation_fields["ID"]],
				"fields":master_fields
			})


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


		for region in master_tables:
			update_table("v3",region,master_tables[region],lang+' Translation')

		update_table('b',lang,mark_export)


	if not activity=={}:
		db_time.child(get_time().split('T')[0]).update(activity)



meta=get_meta()
hash_dict={}


def pull_data(request):
	global hash_dict
	hash_dict=get_hash_dict(meta)
	pull_curation()
	pull_digestion()
	pull_translation()



#pull_data('sds')


#export GOOGLE_APPLICATION_CREDENTIALS="./translate_keys.json"
#gcloud functions deploy pull_data --runtime python37 --trigger-http --allow-unauthenticated
