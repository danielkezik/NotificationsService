#!/usr/bin/env python

import asyncio
import json
import logging
import websockets
import ssl
import pathlib
import collections
from flask import Flask, request
import multiprocessing

logging.basicConfig()

WEBSITES = {}
ALL_USERS = {}
USERS = {}
UCLASSES = {}


async def send_notification(website, uid, notification):
    if website in USERS and uid in USERS[website]:
        await USERS[website][uid].send(notification)

async def send_notifications(website, uclass, notification):
    if website in UCLASSES and uclass in UCLASSES[website]:  # asyncio.wait doesn't accept an empty list
        await asyncio.wait([user.send(notification) for user in UCLASSES[website][uclass]])

def register_user(website, uid, websocket):
    if not website in USERS:
        USERS[website] = {}
    if "users" in ALL_USERS[websocket] and ALL_USERS[websocket]["users"] != uid:
        USERS[website].pop(ALL_USERS[websocket]["users"])
    USERS[website][uid] = websocket
    ALL_USERS[websocket]["users"] = uid
    ALL_USERS[websocket]["website"] = website

def register_to_class(website, uclass, websocket):
    if not website in UCLASSES:
        UCLASSES[website] = {}
    if not uclass in UCLASSES[website]:
        UCLASSES[website][uclass] = set()
    UCLASSES[website][uclass].add(websocket)
    ALL_USERS[websocket]["uclasses"] = uclass
    ALL_USERS[websocket]["website"] = website

async def register(websocket):
    ALL_USERS[websocket] = {}

async def unregister(websocket):
    if "users" in ALL_USERS[websocket]:
        USERS[ALL_USERS[websocket]["website"]].pop(ALL_USERS[websocket]["users"])
    if "uclasses" in ALL_USERS[websocket]:
        UCLASSES[ALL_USERS[websocket]["website"]][ALL_USERS[websocket]["uclasses"]].remove(websocket)
        if len(UCLASSES[ALL_USERS[websocket]["website"]][ALL_USERS[websocket]["uclasses"]]) == 0:
            UCLASSES[ALL_USERS[websocket]["website"]].pop(ALL_USERS[websocket]["uclasses"])
    ALL_USERS.pop(websocket)

def check_credentials(website, token):
    return website in WEBSITES and WEBSITES[website] == token

def init_websites():
    WEBSITES['site.com'] = 'qwerty1234'
    #todo read all sites from file

async def notification_sender(websocket, path):
    await register(websocket)
    try:
        async for message in websocket:
            data = json.loads(message)
            if not "action" in data:
                continue
            if data["action"] == "register_uid":
                register_user(data["website"], data["uid"], websocket)
            elif data["action"] == "register_uclass":
                register_to_class(data["website"], data["uclass"], websocket)
            elif data["action"] == "send_notification":
                if (check_credentials(data["website"], data["token"])):
                    await send_notification(data["website"], data["uid"], data["notification"])
            elif data["action"] == "send_notifications":
                if (check_credentials(data["website"], data["token"])):
                    await send_notifications(data["website"], data["uclass"], data["notification"])
            else:
                pass #logging.error("unsupported event: {}", data)
    finally:
        await unregister(websocket)

init_websites()
start_server = websockets.serve(notification_sender, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

