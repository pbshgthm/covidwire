import requests
import json
import flask

url=json.load(open('./slack_webhook.json'))["url"]
def feedback_via_slack(request):

	content=[i+" : "+request.json[i] for i in request.json]
	print(content)
	payload = '{"text":"'+"\n".join(content)+'"}'
	headers = {
        'Content-Type': 'application/json'
    }
	requests.request("POST", url, headers=headers, data=payload)

	response = flask.jsonify(user)
	response.headers.set('Access-Control-Allow-Origin', '*')
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST')
	return response
#feedback_via_slack({"asa":"123","apple":"pie"})

#gcloud functions deploy feedback_via_slack --runtime python37 --trigger-http --allow-unauthenticated
