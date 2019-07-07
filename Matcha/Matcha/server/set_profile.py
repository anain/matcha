import os
from Matcha import app, logger
from flask import request, render_template, session, Response, redirect
from termcolor import colored
from werkzeug.utils import secure_filename
from Matcha.server.tools import send_cmd_with_args
import psycopg2, json
import base64

@app.route('/upload/', methods=['POST'])
def upload():
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try:
        profile_pic = (str(request.files['picture'].filename) == 'profile_pic')
        img = request.files['picture'].read()
        with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
            with conn.cursor() as cur:
                binary = psycopg2.Binary(img)
                if 'id' in request.form:
                    idd = str(request.form['id'])
                    cur.execute("DELETE FROM pictures WHERE id=%s;", (idd,))
                    conn.commit()
                    cur.execute("INSERT INTO pictures(id, user_id, profile_pic, img) VALUES (%s, %s, %s, %s) RETURNING json_build_object('id', id, 'profile_pic', profile_pic, 'img', encode(img, 'base64'));", (idd, session['id'], profile_pic, binary))
                else:
                    cur.execute("INSERT INTO pictures(user_id, profile_pic, img) VALUES (%s, %s, %s) RETURNING json_build_object('id', id, 'profile_pic', profile_pic, 'img', encode(img, 'base64'));", (session['id'], profile_pic, binary))
                conn.commit()
                c = cur.fetchone()
                img = c[0]
                cmd = "SELECT set_complete(%s);"
                cur.execute(cmd, (session['id'],))
                c = cur.fetchone()
                if not c:
                    c = [False]
                return Response(json.dumps({"img": img, "complete": c[0]}),status= 200,mimetype='application/json')
    except Exception as e:
        logger.error("ERROR ON UPLOAD - " + str(e))
        return Response(status=304)
             
@app.route('/profile/editgeoloc/', methods=['POST'])
def update_geoloc_show():
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302) 
    info = request.get_json()
    try:
        with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
            with conn.cursor() as cur:
                cmd = "UPDATE users SET geoloc_show = %s WHERE id = %s;"
                cur.execute(cmd, (info['new_value'], session['id']))
                conn.commit()
        return Response(status= 200)
    except Exception as e:
        logger.error("ERROR ON UPDATING GEOLOC_SHOW - " + str(e))
        return Response(status= 304)


@app.route('/profile/editprofile/', methods=['POST'])
def change_profile():
    info = request.get_json()
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try:
        with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
            with conn.cursor() as cur:
                cmd = "SELECT edit_profile(%s, %s, CAST(%s AS VARCHAR));"
                cur.execute(cmd, (session['id'], info['field'], info['new_value']))
                conn.commit()
                cmd = "SELECT complete from users WHERE id = %s;"
                cur.execute(cmd, (session['id'],))
                c = cur.fetchone()
                if c and c[0] == True:
                    return Response(json.dumps({"complete" : True}),status= 200,mimetype='application/json')
            return Response(json.dumps({"complete" : False}),status= 200,mimetype='application/json')
    except:
        logger.error("ERROR ON CHANGE PROFILE- " + str(e))
        return Response(status= 304)

@app.route('/profile/tags/', methods=['POST'])
def add_tags():
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try:
        tags_list = request.get_json()['tags_list']
        with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
            with conn.cursor() as cur:
                if len(tags_list) == 0:
                    cmd = "DELETE from users_tags WHERE user_id = %s; UPDATE users SET complete = false WHERE id = %s;"
                    cur.execute(cmd, (session['id'], session['id']))
                else:
                    cmd = "SELECT edit_tags(%s, %s);"
                    cur.execute(cmd, (session['id'], tags_list))
                conn.commit()
                cmd = "SELECT complete from users WHERE id = %s;"
                cur.execute(cmd, (session['id'],))
                c = cur.fetchone()
                if c and c[0] == True:
                    return Response(json.dumps({"complete" : True}),status= 200,mimetype='application/json')
            return Response(json.dumps({"complete" : False}),status= 200,mimetype='application/json')
    except:
        logger.info("ERROR ON UPDATING TAGS - " + str(e))
        return Response(status= 304)