from flask import request, session, Response, redirect
import psycopg2
from Matcha import app, logger
from Matcha.server.get_profile import get_profile_by_id
from Matcha.server.tools import json_resp_to_request, list_resp_to_request, send_cmd_with_args
from Matcha.server.users_interactions import get_forbidden_list
from termcolor import colored
from datetime import date
from dateutil import relativedelta
import os, json
import geopy.distance
from geopy.geocoders import Nominatim
import requests 
from collections import Counter

@app.route('/search/', methods=['POST'])
def search(): 
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    criteria = request.get_json()
    if not criteria:
       return Response(json.dumps({'criteria': criteria, 'res': None}), status= 200, mimetype='application/json')
    if 'data' in criteria:
        criteria = json.loads(criteria['data'])
    ptm = json.loads(get_profile_by_id(session['id']))
    if len(ptm) == 0:
        return Response(status= 404)
    if 'gender' in criteria and criteria['gender'] is not None:
        search_gender = criteria['gender']['genderCode']
    else:
        try:
            cmd = "SELECT sex_orientation FROM users WHERE id = %s"
            search_gender = json.loads(list_resp_to_request(cmd, [session['id'], ]))[0]
        except:       
            logger.error(f"SEARCH - Failed to get sex_orientation of {session['id']}")
            search_gender = 'M|F'
    try:
        cmd = "SELECT gender FROM users WHERE id = %s"
        user_gender = json.loads(list_resp_to_request(cmd, [session['id'], ]))[0]
    except Exception as e:
        msg = f"SEARCH - Failed to get gender of {session['id']} + {str(e)}"
        logger.error(msg)
        return Response(status= 401)
    if not criteria['geoloc']['city']:
        criteria["geoloc"] = json.dumps({"city": ptm["geoloc_city"], "distance" : 1000})
        criteria["geoloc"] = json.loads(criteria["geoloc"])
    geoloc = criteria["geoloc"]
    if  str(geoloc["city"]).lower() ==  str(ptm["geoloc_city"]).lower():
        coord = (ptm['geoloc_lat'], ptm['geoloc_long'])
    else:
        geolocator = Nominatim()
        location = geolocator.geocode(geoloc['city'])
        if not location:
            return Response(json.dumps({'crit': criteria, 'res': None}), status= 200, mimetype='application/json')
        coord = (location.latitude, location.longitude)
    cmd = "SELECT id, username, distance, age, age_diff, short_desc, popularity_score, gender, tag_score, img FROM search(%s, %s, %s, CAST( %s AS REAL), CAST(%s AS REAL), CAST(%s AS VARCHAR), CAST( %s AS VARCHAR), %s, %s,  %s, CAST( %s AS integer[]),  %s,  %s,  %s)"
    try:
        found_list = json.loads(json_resp_to_request(cmd, (session['id'], criteria['age']['max'], criteria['age']['min'], coord[0], coord[1], search_gender, user_gender, geoloc['distance'], criteria['popularity']['min'], criteria['popularity']['max'],  criteria['tags'], app.config['users_results_nb'], (criteria['moreSearch']) * app.config['users_results_nb'], criteria['currentOrder'])))
        if len(found_list) <= 0:
            return Response(json.dumps({'crit': criteria, 'res': None}), status= 200, mimetype='application/json')
        send_cmd_with_args("INSERT INTO searchs(user_id, criteria, timestamp) VALUES(%s, %s, now());", [session['id'], json.dumps(criteria)])
        res = {'crit': criteria, 'res': found_list}
        return Response(json.dumps(res), status= 200, mimetype='application/json')
    except Exception as e:
        msg = f"SEARCH - Failed to get results for search of {session['id']} : {str(criteria)} - {str(e)}"
        logger.error(msg)
        return Response(status= 404)

@app.route('/lastsearch/', methods=['POST'])
def get_last_search():
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try:
        cmd = "SELECT criteria FROM searchs WHERE user_id = %s ORDER by timestamp DESC limit 1"
        crit = json.loads(list_resp_to_request(cmd, [session['id'],]))
        if not crit:
            return Response(status= 200)
        crit[0]['moreSearch'] = 0
        return Response(json.dumps(crit[0]), status= 200, mimetype='application/json')
    except Exception as e:
        msg = f"LASTSEARCH - Failed to get last search - {str(e)}"
        logger.error(msg)
        return Response(status= 404)


