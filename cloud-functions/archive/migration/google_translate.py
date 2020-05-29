from google.cloud import translate
from google.oauth2 import service_account
import json

client = translate.TranslationServiceClient()
parent = client.location_path('covidwire', "global")

def translate_text(text,lang):
	lang_code={
		'Telugu':'te',
		'Hindi':'hi',
		'Marathi':'mr'
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
