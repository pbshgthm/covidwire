import hashlib
import hmac
import json
import requests
from flask import jsonify
import time

with open("slack_config.json", "r") as f:
    data = f.read()

config = json.loads(data)


#VERIFY SLACK WEBHOOK
def verify_signature(request):
    timestamp = request.headers.get("X-Slack-Request-Timestamp", "")
    signature = request.headers.get("X-Slack-Signature", "")

    req = str.encode("v0:{}:".format(timestamp)) + request.get_data()
    request_digest = hmac.new(
        str.encode(config["SLACK_SECRET"]),
        req, hashlib.sha256
    ).hexdigest()
    request_hash = "v0={}".format(request_digest)

    if not hmac.compare_digest(request_hash, signature):
        raise ValueError("Invalid request/credentials.")


#BLOCK OPTIONS FOR STATE
def state_options():
	meta=requests.get('https://covidwire.firebaseio.com/meta.json').json()

	options=[]
	for i in meta:
		if not meta[i]["type"]=="Empty":
			options.append({
				"text": {
					"type": "plain_text",
					"text": meta[i]['name'],
				},
				"value": meta[i]['name']
			})

	return options


#BLOCK OPTIONS FOR GENERAL
def general_options():

	opt=["Global","National"]
	options=[]
	for i in opt:
		options.append({
			"text": {
				"type": "plain_text",
				"text": i,
			},
			"value": i
		})

	return options


#LISTEN TO SLASH COMMANDS
def slash_commands(request):

	if request.method != "POST":
		return "Only POST requests are accepted", 405

	verify_signature(request)
	update_type=request.form['command']

	if update_type=="/update_state":
		options=state_options()
		prompt="Select the state you want to update"
		placeholder="Select state"

	if update_type=='/update_general':
		options=general_options();
		prompt="Select the region you want to update"
		placeholder="Select region"

	response={
		"text":prompt,
        "blocks": [{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": prompt
				},
				"accessory": {
					"type": "static_select",
					"placeholder": {
						"type": "plain_text",
						"text": placeholder,
					},
					"options": options
				}
			}]
    	}



	return jsonify(response)
