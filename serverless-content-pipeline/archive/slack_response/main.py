from flask import jsonify
import requests, json, time


def update_db(data):
	headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
	url="https://us-central1-covidwire.cloudfunctions.net/update"
	return requests.post(url,data=json.dumps(data),headers=headers)


def slash_respond(request):
	param = request.get_json(silent=True)
	response_url=param["response_url"]
	time.sleep(10)

	data={'type':'meta'}
	update_db(data)

	response = message = {
        "response_type": "in_channel",
        "text": "Task completed boi",
        "attachments": []
    }
	
	requests.post(response_url,data=json.dumps(response))
	return
