from flask import request, url_for, render_template, flash, redirect, session, make_response, Response
from Matcha import app, logger
import psycopg2
import os
import json
import mimetypes
from termcolor import colored
from Matcha.server.tools import crypt_pwd, json_resp_to_request
from flask_socketio import send, emit, leave_room, disconnect
from .. import socketio
from flask_cors import cross_origin


@app.route('/login/',  methods=['POST'])
def login():
    json_input = request.get_json()
    logger.debug("LOGIN - input: " + str(json_input))
    pwd = crypt_pwd(json_input['password'])
    cmd = "SELECT id, username FROM users WHERE mail = %s AND password = %s"
    args = [json_input['mail'], pwd]
    try:
        data = json.loads((json_resp_to_request(cmd, args)))
        if not data or data is None:
            return Response(status=401,mimetype='application/json')
        try:
            with psycopg2.connect("dbname='matcha' user=%s password=%s" % (os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
                with conn.cursor() as cur:
                    cur.execute("UPDATE users SET last_connection = now() WHERE mail = %s;", (json_input['mail'],))
                    conn.commit()
                    cur.execute("UPDATE users SET online = true WHERE mail = %s;", (json_input['mail'],))
                    conn.commit()
        except: 
            logger.error("Connection not registered in users table - User :" + data[0]['id'])
        session['id'] = data[0]['id']
        session['username'] = data[0]['username']
        response = Response(json.dumps(data[0]),status= 200,mimetype='application/json')
        return response
    except: 
        message = "An error occured. Please retry later."
        response = Response(json.dumps(message),status= 300,mimetype='application/json')
        return response
        
@app.route('/logout/',  methods=['POST'])
def logout():
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try:
        with psycopg2.connect("dbname='matcha' user=%s password=%s" % (os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE users SET online = false, last_connection = now() WHERE id = %s; ", (session['id'],))
                conn.commit()
    except:
        logger.error("Logout not registered in users table - User :" + str(session['id']))
    logger.debug(f"LOGOUT + {session['id']}")
    session.pop('id')
    return Response(status= 200)

