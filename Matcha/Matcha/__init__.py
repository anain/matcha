from flask import Flask, render_template, request, session
from flask_mail import Mail, Message
from flask_socketio import SocketIO
from termcolor import colored
import logging
import os
import schedule
import time, random
from threading import Thread
from flask_cors import CORS

app = Flask(__name__, static_folder="./static", template_folder="./static", static_url_path='')
app.config['SECURITY_PASSWORD_SALT'] = ("myprecioustwo").encode('utf-8')
app.config['SECRET_KEY'] = "asasa123matcha"
app.config['users_table'] = 'users'
app.config['chat_table'] = 'chat'
app.config['clear_users_timedelta'] = 7000
app.config['user_delay'] = '2 MONTHS'
app.config['messages_step'] = 20
app.config['users_results_nb'] = 10
app.config['match_nb'] = 100
app.config['users_results_nb_matches'] = 5
CORS(app, supports_credentials=True)

mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": 'noreply.matcha.noreply@gmail.com',
    "MAIL_PASSWORD": 'joronain'
}
app.config.update(mail_settings)
app.config['SECURITY_PASSWORD_SALT'] = ("myprecioustwo").encode('utf-8')
app.config['users_table'] = 'users'
app.config['chat_table'] = 'chat'
app.config['connected_users'] = []
mail = Mail(app)

app.config['SESSION_TYPE'] = 'filesystem'
socketio = SocketIO(app, manage_session=True)

path = os.getcwd() 
if os.path.isdir(path +  '/Matcha/logs'):
    logger = logging.getLogger('matcha_logger')
    hdlr = logging.FileHandler(path + '/Matcha/logs/matcha.log')
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    hdlr.setFormatter(formatter)
    logger.addHandler(hdlr) 
    logger.setLevel(logging.INFO)
else:
    logger = logging.getLogger('matcha_logger')
    hdlr = logging.FileHandler(path + 'matcha.log')
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    hdlr.setFormatter(formatter)
    logger.addHandler(hdlr) 
    logger.setLevel(logging.WARNING)

import Matcha.server.match
import Matcha.server.registration
import Matcha.server.tools
import Matcha.server.login
import Matcha.server.reset
import Matcha.server.chat
import Matcha.server.set_profile
import Matcha.server.get_profile
import Matcha.server.messages
import Matcha.server.search
import Matcha.server.background_tasks

import Matcha.server.users_interactions
from Matcha.server.background_tasks import clean_user_db
import json
import psycopg2

logger.info('The server started.')

@app.route("/")
def index():
   return render_template("./dist/index.html")

def run_schedule():
    schedule.every(24).hours.do(clean_user_db)
    while True:
        schedule.run_pending()
        time.sleep(1)

t = Thread(target=run_schedule)
t.start()

if __name__ == '__main__':
    socketio.run(app)