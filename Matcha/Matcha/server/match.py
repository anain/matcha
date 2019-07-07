from flask import session, Response, request, redirect
import psycopg2 
import os, json
from Matcha import app, logger
from Matcha.server.tools import json_resp_to_request, list_resp_to_request, send_cmd_with_args
from termcolor import colored
from Matcha.server.get_profile import get_profile_by_id
from Matcha.server.users_interactions import get_forbidden_list, get_list_to_avoid
from geopy.geocoders import Nominatim

@app.route('/match/', methods=['POST'])
def match():
    criteria = request.get_json()
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    try :
        ptm = json.loads(get_profile_by_id(session['id']))    
        tags_list = json.loads(ptm['tags_list'])
        tags_list2 = '\', \''.join(tags_list)
        tags_list2 = "('" + tags_list2 + "')"
        cmd = "SELECT id, username, age || ' ans' as age, age_diff, total_score, 'A ' || round(cast(distance as decimal), 0) ||' km' as distance, tag_score, short_desc, popularity_mark, img FROM get_matches(CAST(%s AS INTEGER), CAST(%s AS INTEGER), CAST(%s AS INTEGER))"
        best_matches = json.loads(json_resp_to_request(cmd, [session['id'], int(app.config['users_results_nb_matches']), criteria['matchMore']]))
        return Response(json.dumps(str(json.dumps(best_matches))), status=200, mimetype='application/json')
    except Exception as e:
        logger.error("ERROR GETTING MATCH FOR " + str(session['id']) + ' ' + str(e))
        return Response(status=404)
   
@app.route('/match/filter/', methods=['POST'])
def search_match(): 
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    criteria = request.get_json()
    if 'data' in criteria:
        criteria = json.loads(criteria['data'])
    ptm = json.loads(get_profile_by_id(session['id']))
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
        return Response(status= 404)
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
    cmd = "SELECT id, username, distance, age, age_diff, short_desc, popularity_score, gender, tag_score, img FROM search_in_matches(%s, %s, %s, CAST( %s AS REAL), CAST(%s AS REAL), CAST(%s AS VARCHAR), CAST( %s AS VARCHAR), %s, %s,  %s, CAST( %s AS integer[]),  %s,  %s,  %s, %s)"
    try:
        found_list = json.loads(json_resp_to_request(cmd, (session['id'], criteria['age']['max'], criteria['age']['min'], coord[0], coord[1], search_gender, user_gender, geoloc['distance'], criteria['popularity']['min'], criteria['popularity']['max'],  criteria['tags'], app.config['users_results_nb'], (criteria['moreSearch']) * app.config['users_results_nb'], criteria['currentOrder'], criteria['matches'])))
        if len(found_list) <= 0:
            return Response(json.dumps({'crit': criteria, 'res': None}), status= 200, mimetype='application/json')
        res = {'crit': criteria, 'res': found_list}
        send_cmd_with_args("INSERT INTO searchs(user_id, criteria, timestamp) VALUES(%s, %s, now());", [session['id'], json.dumps(criteria)])
        return Response(json.dumps(res), status= 200, mimetype='application/json')
    except Exception as e:
        msg = f"SEARCH - Failed to get results for search of {session['id']} : {str(criteria)} - {str(e)}"
        logger.error(msg)
        return Response(status= 404)

@app.route('/match/remove/', methods=['POST'])
def remove_match(): 
    if not 'id' in session or session['id'] < 0:
        return redirect("http://0.0.0.0:5000/#/redirection/", code=302)
    criteria = request.get_json()
    cmd = "INSERT INTO nogos(from_id, to_id, timestamp) VALUES(%s, %s, now());"
    try:
        send_cmd_with_args(cmd, [session['id'], criteria['user_id']])
        return Response(status= 200)
    except:
        return Response(status= 404)