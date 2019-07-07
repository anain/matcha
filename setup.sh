#!/bin/bash





rm -rf venv
virtualenv -p python3 venv
source venv/bin/activate
pip install --upgrade setuptools
pip install -r requirements.txt
cd Matcha

PGPASSWORD=$MATCHA_PASSWORD psql -U $MATCHA_USER -f ../Profiles_seed/scripts/init.sql
python3 ../Profiles_seed/generate_profiles.py
PGPASSWORD=$MATCHA_PASSWORD psql -U $MATCHA_USER -f ../Profiles_seed/scripts/update_profile.sql
PGPASSWORD=$MATCHA_PASSWORD psql -U $MATCHA_USER -f ../Profiles_seed/scripts/define_interactions.sql
PGPASSWORD=$MATCHA_PASSWORD psql -U $MATCHA_USER -f ../Profiles_seed/scripts/generate_users_interactions.sql
PGPASSWORD=$MATCHA_PASSWORD psql -U $MATCHA_USER -f ../Profiles_seed/scripts/search_functions.sql
PGPASSWORD=$MATCHA_PASSWORD psql -U $MATCHA_USER -f ../Profiles_seed/scripts/update_profile.sql