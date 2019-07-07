from Matcha import app, logger
from Matcha.server.tools import send_cmd_with_args, json_resp_to_request
from datetime import datetime, timedelta, time
import json
from termcolor import colored

def clean_user_db():
    cmd = "SELECT id, timestamp from users WHERE active = false ORDER BY timestamp"
    try:
        unactive_ids = json.loads(json_resp_to_request(cmd, (False,)))
        ids_to_delete = []
        for user in unactive_ids:
            if (datetime.now() - datetime.strptime(user['timestamp'], "%Y-%m-%dT%H:%M:%S.%f") >= timedelta(0, app.config['clear_users_timedelta'])):
                ids_to_delete.append(str(user['id']))
        cmd = "DELETE FROM users WHERE id IN (" +  (', '.join(ids_to_delete)) + ');'
        send_cmd_with_args(cmd, (True, ))
    except:
         logger.error('CLEAN_USER_DB error')

