from flask import session, Response
from Matcha import app, mail
import os, psycopg2, json
from itsdangerous import URLSafeTimedSerializer
import hashlib 
from termcolor import colored
from Matcha import logger
from Matcha.server.messages import get_users_list
from Matcha.server.tools import list_resp_to_request, json_resp_to_request

def get_black_list():
    try:
        cmd = "SELECT DISTINCT to_id FROM blocks WHERE from_id= %s"
        return json.dumps({"status" : 200, "content" : list_resp_to_request(cmd, [session['id'],])})
    except Exception as e:
        msg = f"Failed to get black_list for {session['id']}. " + str(e)
        logger.info(msg)
        return json.dumps({"status" : 500, "message" : msg})
        
def get_blacked_list():
    try:
        cmd = "SELECT DISTINCT from_id FROM blocks WHERE to_id= %s"
        return json.dumps({"status" : 200, "content" : list_resp_to_request(cmd, [session['id'],])})
    except Exception as e:
        msg = f"Failed to get blacked_list for {session['id']}. " + str(e)
        logger.info(msg)
        return json.dumps({"status" : 204, "message" : msg})

def get_matches_list():
    try:
        cmd = "SELECT to_id FROM matches WHERE from_id= %s UNION SELECT from_id FROM matches WHERE to_id = %s;"
        return json.dumps({"status" : 200, "content" : list_resp_to_request(cmd, [session['id'], session['id']])})
    except Exception as e:
        msg = f"Failed to get matches_list for {session['id']}. " + str(e)
        logger.info(msg)
        return json.dumps({"status" : 500, "message" : msg})

def get_list_to_avoid(): 
    forbidden_list = json.loads(get_forbidden_list())
    if forbidden_list['success'] <= 0:
        return json.dumps({"success" : -1, "message" : forbidden_list["message"]})
    cmd = "SELECT DISTINCT to_id FROM views WHERE from_id = %s AND age(now(), timestamp) < INTERVAL %s UNION SELECT DISTINCT to_id FROM messages WHERE from_id = %s AND age(now(), timestamp) < INTERVAL %s;"
    try:
        avoided_list = json.loads(list_resp_to_request(cmd, [session['id'], app.config['user_delay'], session['id'], app.config['user_delay']]))
    except Exception as e:
        msg = f"GET_LIST_TO_AVOID - Failed to get list to avoid for {session['id']} - {str(e)}" 
        logger.error(msg)
        avoided_list = [] 
    forbidden_list['content'].extend(avoided_list)
    return json.dumps({"success" : 1, "content" : forbidden_list['content']})


def get_forbidden_list(): 
    try:    
        cmd = "(SELECT DISTINCT to_id AS id FROM blocks WHERE from_id= %s) UNION (SELECT DISTINCT from_id AS id FROM blocks WHERE to_id= %s)"
        black_list = json.loads(list_resp_to_request(cmd, [session['id'], session['id']]))
        black_list.append(session['id'])
        return json.dumps({"success" : 1, "content" : black_list})
    except Exception as e:
        msg = f"Failed to get avoid_list for {session['id']}. " + str(e)
        logger.info(msg)
        return json.dumps({"success" : -1, "message" : msg})
