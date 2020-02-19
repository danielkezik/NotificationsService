from flask import Flask, request
from flask_cors import CORS, cross_origin
import asyncio
import websockets
import json

uri = "ws://localhost:8102"

async def send_notification(website, token, uid, notification):
    async with websockets.connect(uri) as websocket:
        msg = {
            'action': 'send_notification',
            'website': website,
            'token': token,
            'uid': uid,
            'notification': notification
        }
        await websocket.send(json.dumps(msg))
    

async def send_notifications(website, token, uclass, notification):
    async with websockets.connect(uri) as websocket:
        msg = {
            'action': 'send_notifications',
            'website': website,
            'token': token,
            'uclass': uclass,
            'notification': notification
        }
        await websocket.send(json.dumps(msg))

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/', methods=['GET','POST'])
@cross_origin()
def result():
    rv = request.values
    if ("website" in rv) and ("token" in rv):
        if ("notification" in rv) and ("uid" in rv):
            asyncio.run(send_notification(rv["website"], rv["token"], rv["uid"], rv["notification"]))
            return json.dumps({"result":"sent"})
        if ("notification" in rv) and ("uclass" in rv):
            asyncio.run(send_notifications(rv["website"], rv["token"], rv["uclass"], rv["notification"]))
            return json.dumps({"result":"sent"})
    return json.dumps({"result":"unknown"})

#app.debug = True
app.run(host = 'localhost', port=8101)
