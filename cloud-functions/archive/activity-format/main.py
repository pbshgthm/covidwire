import requests
from flask import jsonify

def activity_format(request):
	date=request.args.get('date')
	url="https://covidwire.firebaseio.com/progress/"+date+".json"
	r = requests.get(url = url).json()
	return jsonify([v for k, v in r.items()])
