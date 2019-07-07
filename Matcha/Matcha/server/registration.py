import psycopg2
from Matcha import app, logger
from termcolor import colored
from flask import request, url_for, render_template, flash, redirect, Response, session
import hashlib, datetime, os, json
from email.mime.text import MIMEText
from Matcha.server.tools import send_mail, send_cmd, delete_user, generate_confirmation_token, confirm_token, send_cmd_with_args, crypt_pwd

@app.route("/createuser", methods=['POST'])
def createuser():
    json_input = request.get_json() 
    try:
        if (not check_mail_availability(json_input['mail'])):
            return Response(status= 401)
        if (existing_username(json_input['username']) == True):
            return Response(status= 401)
        else:
            return putindb(json_input)
    except Exception as e:
        logger.error("ERROR ON CREATEUSER - " + str(e))
        return Response(status= 404)

@app.route("/updatemail/", methods=['POST'])
def update_mail():
    json_input = request.get_json()
    try:
        if (not check_mail_availability(json_input['mail'])):
            return Response(status= 401)
        else:
            token_mail = generate_confirmation_token(str(json_input['mail']))
            token_id = generate_confirmation_token(str(session['id']))
            send_mail(json_input['mail'], "Changement d'identifiants", render_template('mails/resetmail.html', confirm_url ="http://0.0.0.0:5000/confirm/mail/%s/%s/" %(token_mail, token_id)))
            return Response(status= 200)
    except Exception as e:
        logger.error("ERROR ON RESETMAIL - " + str(e))
        return Response(status= 404)

def putindb(json_input): 
    try:
        token = generate_confirmation_token(json_input['mail'])
        cryptedpassword = crypt_pwd(json_input['password'])  
        cmd = "INSERT INTO users(timestamp, mail, password, username, name, first_name) VALUES(now(), %s, %s, %s, %s, %s);"
        args = [json_input['mail'], cryptedpassword, json_input['username'], json_input['name'], json_input['first_name']]
        with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
            with conn.cursor() as cur:
                cur.execute(cmd, (args))
                send_mail(json_input['mail'], "Bienvenue sur Matcha", render_template('mails/confirmation.html', user_name=json_input['username'], confirm_url ="http://0.0.0.0:5000/confirm/%s" %(token)))
                conn.commit()
                return Response(status= 200)
    except Exception as e:
        logger.error("ERROR ON PUTINDB - " + str(e))
        return Response(status= 404)


def existing_username(username):
    cmd = "SELECT EXISTS (SELECT TRUE FROM %s WHERE username='%s'LIMIT 1);" %(app.config['users_table'], username)
    with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
        with conn.cursor() as cur:
            cur.execute(cmd)
            return (cur.fetchone())[0]

def check_mail_availability(mail):
    cmd = "SELECT id, active FROM users WHERE mail = %s;"
    with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
        with conn.cursor() as cur:
            cur.execute(cmd, (mail,))
            lines = cur.fetchall()
            for row in lines:
                if (row[1] == False):
                    delete_user(row[0])
                else:
                    return False
            return True

@app.route("/confirm/mail/<token_mail>/<token_id>/", methods=['GET'])
def confirm_mail_update(token_mail, token_id):
    try:
        email = confirm_token(token_mail)
        user_id = confirm_token(token_id)
        cmd = "UPDATE users SET mail = %s WHERE id = %s;"
        send_cmd_with_args(cmd, (email, user_id))
        return redirect("http://0.0.0.0:5000/#/updatedmail/success/", code=302)
    except Exception as e:
        logger.error("RESETMAIL - " + str(e))
        return redirect("http://0.0.0.0:5000/#/updatedmail/failure/", code=304)


@app.route("/confirm/<token_mail>", methods=['GET', 'POST'])
def validate(token_mail):
    try:
        email = confirm_token(token_mail)
        cmd = "UPDATE users SET active = True WHERE mail=%s;"
        send_cmd_with_args(cmd, [email,])
        return redirect("http://0.0.0.0:5000/#/registration/success/", code=302)
    except Exception as e:    
        logger.error("ERROR ON CONFIRM MAIL TOKEN - " + str(e))
        return redirect("http://0.0.0.0:5000/#/registration/failure/", code=304)
