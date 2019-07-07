from flask import request, session, Response, redirect
from Matcha import app, logger
from .. import socketio
import psycopg2, os, json
from termcolor import colored
from Matcha.server.tools import list_resp_to_request, json_resp_to_request, send_cmd_with_args
from Matcha.server import notifications

@app.route('/messages/setseen/', methods=['POST'])
def set_seen():
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    data = request.get_json()
    try:
        cmd = "UPDATE messages SET seen = true WHERE from_id = %s AND to_id = %s;"
        send_cmd_with_args(cmd, (data['contact'], session['id']))
        return Response(status= 200)
    except Exception as e:
        logger.error("Failed to set messages as seen")
        return Response(status= 202)

@app.route('/messages/getuserslist/')
def get_users_list():
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    cmd = "WITH messages AS (SELECT from_id, count(id) AS msg_nb FROM messages WHERE to_id = %s AND seen = false GROUP BY from_id)\
        SELECT match_user_id, username, encode(img, 'base64') AS img, coalesce(messages.msg_nb, 0) AS msg_nb FROM (SELECT from_id as match_user_id FROM matches \
            WHERE to_id = %s UNION SELECT to_id as match_user_id FROM matches WHERE from_id = %s) AS matches_ids \
                LEFT JOIN users on match_user_id = users.id LEFT JOIN pictures on match_user_id = pictures.user_id \
                    LEFT JOIN messages ON messages.from_id = users.id \
                        WHERE (profile_pic = true OR img IS NULL) GROUP BY match_user_id, username, img, msg_nb"
    try:
        return Response(json.dumps(json.loads(json_resp_to_request(cmd, [session['id'], session['id'], session['id']]))),status= 200,mimetype='application/json')
    except Exception as e:
        msg = f"Failed to get messages_users_list for {session['id']}. " + str(e)
        logger.error(msg)
        return Response(status= 204)


@app.route('/messages/getmessages/', methods=['POST', 'GET'])
def get_messages():
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    logger.debug("GET_MESSAGES " + str(session['id']))
    if not 'offset' in session or not session['offset']:
        session['offset'] = 0
    data = request.get_json()
    if 'offset' in data:
        session['offset'] = data['offset']
    cmd = "SELECT * FROM (SELECT * from messages WHERE (from_id = %s AND to_id = %s) OR (from_id = %s AND to_id = %s) ORDER BY timestamp DESC limit %s offset %s) AS t ORDER BY timestamp" 
    try:
        messages = json_resp_to_request(cmd, [session['id'], data['contact'], data['contact'], session['id'], app.config['messages_step'], session['offset'] * app.config['messages_step']])
        return Response(json.dumps({"id" : data['contact'], "content": messages}),status= 200,mimetype='application/json')
    except Exception as e:
        msg = f"Failed to get messages for {session['id']} and {data['contact']}. " + str(e)
        logger.error(msg)
        return Response(status= 204)