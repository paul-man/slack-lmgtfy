#!/bin/bash -e
set -x
git commit -a -m "$1"
git push origin master
git push heroku master
