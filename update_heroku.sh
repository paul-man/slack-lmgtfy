#!/bin/bash
set -x
git -a -m "$1"
git push origin master
git push heroku master
