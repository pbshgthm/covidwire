import hashlib
import hmac
import json
import requests
from flask import jsonify
from threading import Thread

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


#SEND ACKNOWLEDGEMENT OF ACTION
def block_reply(user,table):

	response = {
        "response_type": "in_channel",
        "text": '<@'+user+"> initiated update for "+table
    }

	headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
	url=config["WEBHOOK"]
	requests.post(url,data=json.dumps(response),headers=headers)

	return


#BLOCK RESPONSE WEBHOOK
def block_selection(request):
	form_json = json.loads(request.form["payload"])
	#verify_signature(request)

	user=form_json['user']["id"]
	table=form_json['actions'][0]["selected_option"]["text"]["text"]

	thr = Thread(target=block_reply, args=[user,table])
	thr.start()

	return
