import sys, time
sys.path.append('../Matcha')
import psycopg2
import os, io
from termcolor import colored
from urllib.request import urlopen 
import re, random
import requests
from bs4 import BeautifulSoup
from faker import Faker
from faker.providers import profile, misc, date_time, lorem
import datetime, json
from Matcha.server.registration import existing_username, check_mail_availability
from Matcha.server.tools import crypt_pwd, json_resp_to_request
from PIL import Image
from io import BytesIO 

def make_square(im, min_size=256, fill_color=(0, 0, 0, 70)):
    new_width = 256
    new_height = 256
    width, height = im.size  
    if width < new_width or height < new_height:
        x, y = im.size
        size = max(min_size, x, y)
        new_im = Image.new('RGBA', (size, size), fill_color)
        new_im.paste(im, (int((size - x) / 2), int((size - y) / 2)))
        return new_im
    left = (width - new_width)/2
    top = (height - new_height)/2
    right = (width + new_width)/2
    bottom = (height + new_height)/2
    im.crop((left, top, right, bottom))
    return im

def randomtimes(start, end):
    frmt = '%Y-%m-%d %H:%M:%S'
    stime = datetime.datetime.strptime(start, frmt)
    etime = datetime.datetime.strptime(end, frmt)
    td = etime - stime
    return random.random() * td + stime

def get_diff_pictures(conn, cur, gender, user_id, tries):
    if tries >= 2:
        return
    if (gender == 'M' or gender == 'm'):
        gender = 'men'
    else:
        gender = 'women'
    page = int(user_id) % 99 + tries
    page = str(page)

    site = 'https://pixabay.com/en/photos/%s/?pagi=%s'%(gender, page)
    time.sleep(2)
    response = requests.get(site)
    soup = BeautifulSoup(response.text, 'html.parser')
    chunks = soup.find_all('img', {"data-lazy": True, })
    urls = [im['data-lazy'] for im in chunks]
    nb_img = len(urls)
    if nb_img == 0:
        return get_diff_pictures(conn, cur, gender, user_id, tries + 1)
    choice = int(user_id) % int(nb_img)
    if (choice > nb_img - 5):
        choice = nb_img - 5
    selected_urls = [urls[choice], urls[choice + 1], urls[choice + 2], urls[choice + 3], urls[choice + 4]]
    i_pic = 0
    for url in selected_urls:
        i_pic +=1  
        profile_pic = False
        if (i_pic == 1):
            profile_pic = True
        try:
            headers = {'cache-control': "no-cache"}
            response = requests.request("GET", url, headers=headers)
            tmp_image = Image.open(BytesIO(response.content))
            new_image = make_square(tmp_image)
            imgByteArr = io.BytesIO()
            new_image.save(imgByteArr, format='PNG')
            imgByteArr = imgByteArr.getvalue()
            binary = psycopg2.Binary(imgByteArr)
            cur.execute("INSERT INTO pictures(user_id, img, profile_pic) VALUES(%s, %s, %s)", (user_id, binary, profile_pic))
            conn.commit()
        except:
            get_diff_pictures(conn, cur, gender, user_id, tries + 1)

def generate_fake_profile(nb_profiles):
    print(colored("Making people...", 'green'))
    with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
        with conn.cursor() as cur:
            faker = Faker(locale="fr_FR")
            faker.random.seed(1492)
            random.seed(1492)
            i_inserted = 0
            max_year = 2000
            min_year = 1918
            while (i_inserted < nb_profiles):
                print(colored("inserted " + str(i_inserted),'green'))
                profile = faker.profile()
                username = profile['username'][:59]
                if existing_username(username):
                    username = username + str(i_inserted)
                mail = username + "@yopmail.com",
                if (check_mail_availability and not existing_username(username)):
                    time = randomtimes("2018-08-01 2:59:21", str(datetime.datetime.now())[:19])
                    active = bool(random.getrandbits(1))
                    clearpwd = faker.password()[:14]
                    password = crypt_pwd(clearpwd)
                    try:
                        cur.execute("INSERT INTO users(timestamp, clearpwd, active, name, first_name, mail, password, username) VALUES(%s, %s, %s, %s, %s, %s, %s, %s);", \
                        (time, clearpwd, active, profile['name'].split()[1][:59], profile['name'].split()[0][:59], mail, password, username))
                        i_inserted += 1
                        conn.commit()  
                    except: 
                        conn.rollback()
                        raise
                    if (active == True):
                        date = faker.date_time_between(start_date="-80y", end_date="-18y", tzinfo=None).date()
                        geoloc = faker.local_latlng(country_code="FR", coords_only=False)
                        bis = random.randint(0, 101)
                        if bis >= 1 and bis <= 3:
                            sex_orientation = 'MF'
                        else:
                            sex_orientation = faker.profile()['sex']
                        try:
                            cur.execute("UPDATE users SET complete=true, geoloc_show = true, gender=%s, sex_orientation=%s, birth_date=%s, geoloc_lat=%s, geoloc_long =%s, geoloc_city = %s, profession=%s, short_desc=%s, long_desc=%s, last_connection = %s WHERE username = %s", \
                            (profile['sex'], sex_orientation, date, geoloc[0][:200], geoloc[1], geoloc[2], profile['job'][:59], faker.text(150), faker.text(1000), time, username))
                            conn.commit()     
                            cur.execute("SELECT id FROM users WHERE username=%s;", (username, ))
                            id = cur.fetchone()[0]
                            conn.commit()
                            get_diff_pictures(conn, cur, profile['sex'], int(id), 0)
                        except:
                            conn.rollback()
                            raise
                            
def generate_tags(occ):
    print(colored("TAG GENERATION", 'green'))
    with psycopg2.connect("dbname='matcha' user=%s password=%s" %(os.environ['MATCHA_USER'], os.environ['MATCHA_PASSWORD'])) as conn:
        with conn.cursor() as cur:
            #LEGAL_TAGS
            if occ == 0:
                with open("../Profiles_seed/tags.txt") as f:
                    content = f.readlines()
                    for t in content:
                        if (t.strip()):
                            cur.execute("INSERT INTO legal_tags(tag) VALUES('%s');" %(t.strip()))       
            #USERS_TAGS
            n = 0
            cur.execute("SELECT id FROM legal_tags;")
            all = cur.fetchall()
            n_zero = all[0]
            for r in all:
                n += 1
            get_users_ids = "SELECT id FROM users WHERE active = true AND NOT EXISTS (SELECT * FROM users_tags WHERE user_id = id);"
            cur.execute(get_users_ids)
            lines = cur.fetchall() 
            user_ids_list = []  
            random.seed(712)
            for id in lines:
                user_ids_list.append(id[0])
                id_list = [] 
                while (len(id_list) < 5):
                    k = random.randint(n_zero[0], n_zero[0] + n - 1)
                    if (not k in id_list):
                        id_list.append(k)
                        try:
                            cmd = "INSERT INTO users_tags(tag_id, user_id) VALUES(%d, %d);" %(k, id[0])
                            cur.execute(cmd)
                            conn.commit()
                        except:     
                            conn.rollback()
                            raise


generate_fake_profile(20)
generate_tags(0) 
generate_fake_profile(500)
generate_tags(1) 
os._exit(0)