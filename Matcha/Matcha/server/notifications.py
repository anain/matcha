from flask import request, url_for, render_template, flash, redirect, session, Response
from Matcha import app, logger
from .. import socketio
import psycopg2, os
from termcolor import colored
from Matcha.server.tools import send_cmd_with_args, json_resp_to_request, get_username_by_id, send_cmd, list_resp_to_request
from termcolor import colored
from flask_socketio import send, emit, join_room, leave_room
import json

@app.route('/notifications/getlist/', methods=['POST', 'GET'])
def get_notifications(): 
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try:
        cmd = "SELECT notifications.id, notifications.from_id, users.username, encode(img, 'base64') AS img, notifications.type, notifications.seen, notifications.timestamp \
            from notifications INNER JOIN users on users.id = notifications.from_id \
                 LEFT JOIN pictures ON users.id = pictures.user_id \
                     WHERE to_id = %s AND (profile_pic = true OR img IS NULL) AND check_blocks(%s, notifications.from_id) = false \
                         ORDER BY timestamp DESC"
        notif = json.loads(json_resp_to_request(cmd, [session['id'], session['id']]))
        cmd = "UPDATE notifications SET seen = true WHERE to_id = %s;"
        send_cmd_with_args(cmd, [session['id'],])
        expression = {}
        expression['L'] = ' a aimé votre profil'
        expression['D'] = ' n\'aime plus votre profil'
        expression['V'] = ' a vu votre profil'
        expression['M'] = 'Vous avez un match avec '
        if len(notif) == 0:
            return Response(status= 204,mimetype='application/json')
        for notification in notif:
            if notification["type"] == 'M':
                notification["text"] = 'Vous avez un match avec '  + notification['username']
            else:
                notification["text"] = notification['username'] + expression[notification['type']]
        return Response(json.dumps(notif),status= 200,mimetype='application/json')
    except Exception as e:
        logger.error(f"GET_NOTIFICATIONS - {str(e)}")
        return Response(status= 404)

@app.route('/notifications/getcount/', methods=['POST'])
def get_notifications_count(): 
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try:
        cmd = "SELECT count(id) FROM notifications WHERE to_id = %s AND seen = false;"
        notif = json.loads(list_resp_to_request(cmd, [session['id'],]))
        if notif:
           return Response(json.dumps({"new" : notif[0]}),status= 200,mimetype='application/json')
        return Response(json.dumps({"new" : 0}),status= 200,mimetype='application/json')
    except Exception as e:
        logger.error(f"GET_NOTIFICATIONS COUNT - {str(e)}")
        return Response(status= 404)


