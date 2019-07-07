from flask import request, url_for, render_template, flash, redirect, Response, session
from flask_mail import Mail, Message
from Matcha import app, mail, logger
from Matcha.server.registration import generate_confirmation_token, confirm_token, check_mail_availability
from Matcha.server.tools import send_mail, send_cmd, delete_user, generate_confirmation_token, confirm_token, send_cmd_with_args, crypt_pwd, json_resp_to_request
import os, psycopg2
import hashlib
from termcolor import colored
import json

@app.route("/resetpwd/", methods=['POST'])
def mail_to_reset_pwd():
    json_input = request.get_json() 
    try:
        if (check_mail_availability(json_input['mail'])):
            return "Your are not registered."
        token = generate_confirmation_token(json_input['mail'])
        send_mail(json_input['mail'], "Reset password", render_template('mails/resetpwd.html', confirm_url ="http://0.0.0.0:5000/#/resetpassword/%s"%(token)))
        return Response(status= 200)
    except Exception as e:
        logger.error("ERROR ON RESETPWD - " + str(e))
        return Response(status= 404)

@app.route("/user/resetpassword/validate/", methods=['POST'])
def reset_password():
    try:
        json_input = request.get_json()
        token = json_input["token"]
        email = confirm_token(token)
        cryptedpassword = hashlib.sha256()
        cryptedpassword.update(json_input['password'].encode('utf-8'))
        cmd = "UPDATE %s SET password='%s' WHERE mail='%s';" %(app.config['users_table'], cryptedpassword.hexdigest(), email)
        send_cmd(cmd)
        return Response(status= 200)
    except:
        logger.error("ERROR ON RESET PASSWORD - " + str(e))
        return Response(status= 404)
    
@app.route("/settings/resetpwd/", methods=['POST'])
def settings_reset_password():
    try:
        json_input = request.get_json()
        user_password = crypt_pwd(json_input["user_password"])
        new_password = crypt_pwd(json_input["new_password"])
        cmd = "SELECT password FROM users WHERE id = %s"
        args = [session['id']]
        try:
            data = json.loads((json_resp_to_request(cmd, args)))
            if data[0]['password'] == user_password:
                cmd = "UPDATE users SET password='%s' WHERE id='%s';" %(new_password, session['id'])
                send_cmd(cmd)
                return Response(status= 200)
            else:
                return Response(status= 401)
        except Exception as e:
            logger.error("ERROR ON SETTINGS_RESET_PASSWORD - " + str(e))
            return Response(status= 404)
    except Exception as e:
        logger.error("ERROR ON SETTINGS_RESET_PASSWORD - " + str(e))
        return Response(status= 404)

@app.route("/report/", methods=['POST'])
def report():
    json_input = request.get_json()['data'] 
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try:
        cmd = "INSERT INTO REPORTS(from_id, to_id, timestamp, fakeprofile, behaviour, scam, other, comment) VALUES(%s, %s, now(), %s, %s, %s, %s, %s);"
        (cmd, (session['id'], json_input['to_id'], json_input['charges']['fakeProfile'], json_input['charges']['behaviour'], json_input['charges']['scam'], json_input['charges']['other'], json_input['comment']))
        return Response(status=200)
    except Exception as e:
        logger.error("ERROR ON REPORT - " + str(e))
        return Response(status= 404)
    

