import requests
import json

url=json.load(open('./slack_webhook.json'))["url"]
def feedback_via_slack(request):

	content=[i+" : "+request.json[i] for i in request.json]
	payload = '{"text":"'+"\n".join(content)+'"}'
	headers = {
        'Content-Type': 'application/json'
    }
	print(payload)
	response = requests.request("POST", url, headers=headers, data=payload)
	print(response.text.encode('utf8'))


#feedback_via_slack({"asa":"123","apple":"pie"})

#gcloud functions deploy feedback_via_slack --runtime python37 --trigger-http --allow-unauthenticated
