from flask import session
from flask_mail import Mail, Message
from Matcha import app, mail
import os, psycopg2, json
from itsdangerous import URLSafeTimedSerializer
import hashlib 
from termcolor import colored
from Matcha import logger

def send_mail(to, subject, template):
    msg = Message(
        subject,
        recipients=[to,],
        html=template,
        sender=app.config['MAIL_USERNAME']
    )
    mail.send(msg)

def send_cmd(cmd):
    with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
        with conn.cursor() as cur:
            cur.execute(cmd)
            conn.commit()

def send_cmd_with_args(cmd, args):
    with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
        with conn.cursor() as cur:
            cur.execute(cmd, (args))
            conn.commit()

def delete_user(id_to_delete):
    cmd = "DELETE FROM %s WHERE id=%d;" %(app.config['users_table'], id_to_delete)
    send_cmd(cmd)

def generate_confirmation_token(mail):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(mail, salt=app.config['SECURITY_PASSWORD_SALT'])

def confirm_token(token, expiration=36000):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    email = serializer.loads(
            token,
            salt=app.config['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
    return email

def crypt_pwd(pwd):
    cryptedpassword = hashlib.sha256()
    cryptedpassword.update(pwd.encode('utf-8'))
    return cryptedpassword.hexdigest()

def json_resp_to_request(cmd, args):
    with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT row_to_json(t) FROM (" + cmd + ") t", (args))
            c = cur.fetchall()
            res = []
            for elem in c:
                res.append(elem[0])
            return json.dumps(res)

def list_resp_to_request(cmd, args):
    with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
        with conn.cursor() as cur:
            cur.execute(cmd, (args))
            c = cur.fetchall()
            my_list = []
            for res in c:
                my_list.append(res[0])
            return json.dumps(my_list)

def get_username_by_id(user_id): 
    try:
        cmd = "SELECT username FROM users WHERE id= %s"
        username = json.loads(list_resp_to_request(cmd, [user_id,]))[0]
        return username
    except:
        return ""
