from flask import request, url_for, render_template, flash, redirect, session, Response
from Matcha import app, logger
from .. import socketio
import psycopg2, os, json
from termcolor import colored
from Matcha.server.tools import send_cmd, send_cmd_with_args, list_resp_to_request
from Matcha.server.login import logout
from Matcha.server import notifications
from flask_socketio import send, emit, join_room, leave_room, disconnect
from datetime import datetime
import time

@socketio.on('message')
def handle_message(msg):
    try:
        send(msg, broadcast=True)
    except Exception as e:
            logger.error("MESSAGE ERROR - " + str(e))

@socketio.on('connect')
def con():
    if  'id' in session and session['id'] > 0:
        try:
            join_room(session['id'])
            emit('connect_' + str(session['id']), broadcast=True)
        except Exception as e:
            logger.error("ERROR ON CONNECT - " + str(e))
    
@socketio.on('login')
def joinRoom(data):
        try:
            session['id'] = data
            join_room(session['id'])
            emit('connect_' + str(session['id']), broadcast=True)
        except Exception as e:
            logger.error("ERROR ON LOGIN - " + str(e))
    
@socketio.on('logout')
def leave():
    try:
        with psycopg2.connect("dbname='matcha' user=%s password=%s" % (os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE users SET online = false, last_connection = now() WHERE id = %s; ", (session['id'],))
                conn.commit()
                cur.execute("SELECT to_char(last_connection, 'DD.MM.YY HH24:MI:SS') AS last_connection FROM users WHERE id = %s;", (session['id'],))
                c = cur.fetchone()
    except Exception as e:
        logger.error("Logout not registered in users table - User :" + str(session['id']) + str(e))
    emit('disconnect_' + str(session['id']), {"last" : c[0]}, broadcast=True)
    session.pop('id')

@socketio.on('private_message')
def private_message(data):
    if 'id' in session and session['id'] > 0:
        cmd = "SELECT EXISTS (SELECT id from matches where from_id = %s and to_id = %s UNION SELECT id from matches WHERE from_id = %s AND to_id = %s);"
        try:
            res = json.loads(list_resp_to_request(cmd, (session['id'], data["to"], data["to"], session['id'])))
            if res and res[0] == True:
                emit("private_message", {"message": data["message"], "to": data["to"], "from": session["id"]}, room=data["to"])
                emit("new_message", {"message": data["message"], "to": data["to"], "from": session["id"]}, room=data["to"])
                emit("message_was_sent", {"message": data["message"], "to": data["to"], "from": session["id"]}, room=session['id'])
                send_cmd_with_args("SELECT msg(%s, %s, %s)", [session['id'], data['to'], data['message']])
                emit("message_was_registered", {"content":data["message"]}, room=session['id'])
        except Exception as e:
            logger.error("PRIVATE_MESSAGE NOT SENT - " + str(data) + ' ' + str(e))

@socketio.on('like')
def handle_like(data):
    try:
        check_blocks = json.loads(list_resp_to_request('SELECT check_blocks(%s, %s);', [session['id'], str(data['id'])]))[0]
        if check_blocks == False:
            match = json.loads(list_resp_to_request('SELECT flike(%s, %s, now()::timestamp);', [session['id'], str(data['id'])]))
            emit('notif', room=data['id'])
            if match and match[0] == True:
                emit('match', {"contact": data['username']}, room=session['id'])
    except Exception as e:
        logger.error("LIKE NOT SENT - " + str(data) + ' ' + str(e))
        
        
@socketio.on('dislike')
def handle_dislike(data):
    try:
        check_blocks = json.loads(list_resp_to_request('SELECT check_blocks(%s, %s);', [session['id'], data]))[0]
        if check_blocks == False:
            send_cmd_with_args("SELECT fdislike(%s, %s, now()::timestamp);", ((session['id']), data))
            emit('notif', room=data)
    except Exception as e:
        logger.error("DISLIKE NOT SENT - " + str(data) + ' ' + str(e))


@socketio.on('block')
def handle_block(data):
    try:
        send_cmd_with_args("SELECT fblocks(%s, %s, now()::timestamp);", ((session['id']), data))
    except Exception as e:
        logger.error("BLOCK NOT SENT - " + str(data) + ' ' + str(e))


@socketio.on('unblock')
def handle_unblock(data):
    try:
        send_cmd_with_args('DELETE FROM blocks WHERE from_id = %s AND to_id = %s', [session['id'], data])
    except Exception as e:
        logger.error("UNBLOCK NOT SENT - " + str(data) + ' ' + str(e))

@socketio.on('view')
def handle_view(data):
    try:
        check_blocks = json.loads(list_resp_to_request('SELECT check_blocks(%s, %s);', [session['id'], data]))[0]
        if check_blocks == False and data != session['id']:
            send_cmd_with_args("SELECT fview(%s, %s, now()::timestamp);", ((session['id']), data))
            emit('notif', room=data)
    except Exception as e:
        logger.error("UNBLOCK NOT SENT - " + str(data) + ' ' + str(e))