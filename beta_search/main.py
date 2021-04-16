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
	pageVal=15
	if request.method == 'OPTIONS':
		headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
		return ('', 204, headers)

	keywords=request.json['keywords'].split(' ')
	_filter=request.json['filter']
	page=request.json['page']

	url="https://covidwire.firebaseio.com/index.json"
	data=requests.get(url).json()


	status="FAIL"
	print('searching',keywords,_filter)
	match_list=[]
	for hash in data:
		if is_match(keywords,_filter,data[hash]):
			match_list.append(data[hash])

	result={}

	match_list.sort(reverse=True,key = lambda i: i['time'])
	print(len(match_list))
	for record in match_list[page*pageVal:(page+1)*pageVal]:
		date=record['time'].split('T')[0]
		hash=record['hash']
		if date in result:
			result[date][hash]=record
		else:
			result[date]={hash:record}
		status="OK"


	is_next=len(match_list)>pageVal*(page+1)

	headers = {
        'Access-Control-Allow-Origin': '*'
    }

	return (jsonify({'status':status,'result':result,'next':is_next}), 200, headers)


#v4_search({'keywords':'Vaccine','filter':{'key':'region','value':'Global National Tamil Nadu'},'page':4})

#gcloud functions deploy v4_search --runtime python37 --trigger-http --allow-unauthenticated
