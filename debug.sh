#!/bin/bash

source venv/bin/activate
cd Matcha
export FLASK_APP=Matcha
export FLASK_DEBUG=False
export FLASK_ENV=development

flask run --host=0.0.0.0
