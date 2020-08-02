import requests
from flask import jsonify

def is_match(keywords,_filter,record):
	headline=record['digests']['English']['headline']
	digest=record['digests']['English']['digest']

	for word in keywords:
		if not _filter["key"]=="*":
			if not record[_filter['key']] in _filter['value']:return False
		if word.lower() in headline.lower():return True
		if word.lower() in digest.lower():return True
	return False


def v4_search(request):

	if request.method == 'OPTIONS':
		headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
		return ('', 204, headers)


	url="https://covidwire.firebaseio.com/index.json"
	data=requests.get(url).json()


	keywords=request.json['keywords'].split(' ')
	_filter=request.json['filter']

	result={}
	status="FAIL"
	print('searching',keywords,filter)
	count=0
	for hash in data:
		if is_match(keywords,_filter,data[hash]):
			date=data[hash]['time'].split('T')[0]
			if date in result:
				result[date][hash]=data[hash]
			else:
				result[date]={hash:data[hash]}
			count+=1
			status="OK"
	print(count,"results")


	headers = {
        'Access-Control-Allow-Origin': '*'
    }

	return (jsonify({'status':status,'result':result}), 200, headers)


#gcloud functions deploy v4_search --runtime python37 --trigger-http --allow-unauthenticated
