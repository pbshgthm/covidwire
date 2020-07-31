import requests
import json
import flask

url=json.load(open('./slack_webhook.json'))["url"]
def v4_feedback_slack(request):

	if request.method == 'OPTIONS':
		headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
		return ('', 204, headers)



	content=[i+" : "+request.json[i] for i in request.json]
	print(content)
	payload = '{"text":"'+"\n".join(content)+'"}'
	headers = {
        'Content-Type': 'application/json'
    }
	requests.request("POST", url, headers=headers, data=payload)

	headers = {
        'Access-Control-Allow-Origin': '*'
    }
	return ('Seccess', 200, headers)




#feedback_via_slack({"asa":"123","apple":"pie"})

#gcloud functions deploy v4_feedback_slack --runtime python37 --trigger-http --allow-unauthenticated
