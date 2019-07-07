from flask import request, url_for, render_template, flash, redirect, session, Response
import psycopg2
from Matcha import app, logger
from Matcha.server.tools import json_resp_to_request, list_resp_to_request
import os
import json
from termcolor import colored
import base64
from .. import socketio
from flask_socketio import rooms

@app.route('/profile/', methods = ['POST'])
def get_profile_by_username(): 
    input = request.get_json() 
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try:
        cmd = "SELECT id, username, name, first_name, online, to_char(last_connection, 'DD.MM.YY HH24:MI:SS') AS last_connection, score, gender, sex_orientation, birth_date, profession, geoloc_show, geoloc_lat, geoloc_long, geoloc_city, short_desc, long_desc FROM users WHERE username = %s AND active = True"
        profile = json.loads(json_resp_to_request(cmd, [input['username'],]))
        if len(profile) == 0:
            return Response(status= 404)
        profile = profile[0]
        cmd = "SELECT legal_tags.id, tag AS label FROM legal_tags RIGHT JOIN users_tags ON legal_tags.id = users_tags.tag_id WHERE users_tags.user_id = %s"
        tags = json_resp_to_request(cmd, [int(profile['id']),])
        profile['tags_list'] = str(tags)
        cmd = "SELECT id, profile_pic, encode(img, 'base64') AS img FROM pictures WHERE user_id = %s ORDER BY id"
        profile['pictures'] = json_resp_to_request(cmd, [profile['id'],])
        profile['self'] = False
        profile['liked'] = False
        profile['likes'] = False
        if session['id'] == profile['id']:
            profile['self'] = True
        else:
            cmd = "SELECT type, to_id FROM likes WHERE from_id = %s AND to_id = %s ORDER BY timestamp DESC limit 1;"
            profile_liked = json.loads(list_resp_to_request(cmd, [session['id'], profile['id']]))
            if profile_liked and profile_liked[0] == 1:
                profile['liked'] = True
            profile_likes_you = json.loads(list_resp_to_request(cmd, [profile['id'], session['id']]))
            if profile_likes_you and profile_likes_you[0] == 1:
                profile['likes'] = True
            cmd = "SELECT EXISTS (SELECT id FROM blocks WHERE from_id = %s AND to_id = %s);"
            profile['blocked']= json.loads(list_resp_to_request(cmd, [session['id'], profile['id']]))[0]
            cmd = "SELECT EXISTS (SELECT id FROM blocks WHERE from_id = %s AND to_id = %s);"
            profile['blocks']= json.loads(list_resp_to_request(cmd, [profile['id'], session['id']]))[0]
        return Response(json.dumps(profile),status= 200,mimetype='application/json')
    except Exception as e:
        message = "No profile found for " + str(input['username'])
        logger.error("GET_PROFILE_BY_USERNAME - " + str(e))
        return Response(status= 404)

def get_profile_by_id(user_id): 
    try:
        cmd = "SELECT username, name, first_name, score, gender, sex_orientation, birth_date, profession, geoloc_lat, geoloc_long, geoloc_city, short_desc, long_desc FROM users WHERE id = %s"
        profile = json.loads(json_resp_to_request(cmd, [user_id, ]))
        if len(profile) == 0:
            return ""
        profile = profile[0]
        cmd = "SELECT tag FROM legal_tags LEFT JOIN users_tags ON legal_tags.id = users_tags.tag_id WHERE users_tags.user_id = %s"
        tags = list_resp_to_request(cmd, [user_id,])
        profile['tags_list'] = tags
        profile['self'] = False
        if session['id'] == user_id:
            profile['self'] = True
        return json.dumps(profile)
    except Exception as e:
        logger.error("GET_PROFILE _BY_ID - ") + str(e)
        return ""

@app.route('/profile/navbar/')
def get_profile_pic_and_username_by_id():
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection", code=302)
    try:
        cmd = "WITH matches_id AS (SELECT to_id AS match_id from matches WHERE from_id = %s UNION SELECT from_id AS match_id from matches WHERE to_id = %s), \
            cmessages AS (SELECT to_id, count(id) AS count FROM messages WHERE to_id = %s AND NOT (from_id IN (SELECT hidden_ids.id FROM get_hidden(%s) AS hidden_ids)) AND \
             EXISTS (SELECT * FROM matches_id WHERE match_id = from_id)  \
            AND seen = False GROUP BY to_id)\
            SELECT users.id, users.username, encode(img, 'base64') AS img,(geoloc_lat is null) AS geoloc_empty, complete, mail, pictures.id AS pic_id, coalesce(cmessages.count, 0) AS msg_count FROM users \
            RIGHT JOIN pictures ON users.id = pictures.user_id \
                LEFT JOIN cmessages ON cmessages.to_id = pictures.user_id \
                    WHERE user_id = %s AND profile_pic = True \
                        GROUP BY users.id, username, pictures.img, pic_id, cmessages.count"
        res = json.loads(json_resp_to_request(cmd, [session['id'], session['id'], session['id'], session['id'], session['id']]))
        if not res:
            cmd = "SELECT users.id, users.username FROM users WHERE id = %s"
            res = json.loads(json_resp_to_request(cmd, [session['id'],]))
        return Response(json.dumps(res[0]), status= 200, mimetype='application/json')  
    except Exception as e:
        raise
        logger.error("NAVBAR - " + str(e))
        return Response(status= 404)


@app.route('/alltags/')
def get_tags(): 
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try:
        cmd = "SELECT id, tag AS label FROM legal_tags ORDER BY tag"
        all = json_resp_to_request(cmd, (True, ))
        return Response(json.dumps(all), status= 200, mimetype='application/json')  
    except Exception as e:
        logger.error("ALLTAGS - " + str(e))
        return Response(status=404)