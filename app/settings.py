#!/usr/bin/env python3
# coding: utf-8

# LINC is an open source shared database and facial recognition
# system that allows for collaboration in wildlife monitoring.
# Copyright (C) 2016  Wildlifeguardians
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# For more information or to contact visit linclion.org or email tech@linclion.org

from os.path import realpath, dirname, join, isdir
from os import environ
import site
import sys
import tornado
import tornado.template
import socket
import logging
from sys import executable as pythonbin
from tornado.options import define, options
from handlers.base import BaseHandler
from apscheduler.schedulers.tornado import TornadoScheduler
from logging import info
# from lib.voc_routines import process_voc


# make filepaths relative to settings.
appdir = dirname(realpath(__file__))
info('Working directory: %s' % (appdir))

# add local packages directories to Python's site-packages path
paths = [appdir, appdir + '/handlers', appdir + '/models', appdir + '/lib', appdir + '/utils']
for npath in paths:
    if isdir(npath):
        site.addsitedir(npath)
        sys.path.append(npath)


# port defined as heroku deploy
define("port", default=5080, type=int, help=("Server port"))
define("config", default=None, help=("Tornado configuration file"))
define('debug', default=True, type=bool, help=("Turn on autoreload, log to stderr only"))
tornado.options.parse_command_line()


# Temporary alternative to define app URL
def getHostIp():
    hip = ''
    if 'vagrant' in pythonbin:
        hip = 'localhost'
    else:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        s.connect(('<broadcast>', 0))
        hip = s.getsockname()[0]
    return hip


# config settings
config = {}
config['debug'] = options.debug
config['cookie_secret'] = environ.get('COOKIE_SECRET', 'c84b706bc36363217b2cdf0e615e41c186c5e0cfc6869a078e7243e9affc8e87')
config['xsrf_cookies'] = True
config['app_path'] = appdir
config['version'] = 'LINC webapp version v4.0.0-2018-04-05'
config['static_path'] = join(appdir, "static")
config['template_path'] = join(appdir, "templates")
config['autoescape'] = None
config['default_handler_class'] = BaseHandler

config['scheduler'] = TornadoScheduler()
config['scheduler'].start()
# Check uploaded files to process - every 30 seconds
# config['scheduler'].add_job(process_voc, 'interval', seconds=30, args=[paths])

# Setting URL
# appurl = "https://linc-website.herokuapp.com/"
config['APP_URL'] = environ.get('APP_URL', 'http://localhost:5080')
# config['APP_URL'] = 'http://linc-webapp.venidera.local'
config['login_url'] = config['APP_URL'] + '/#/login'

# Setting linc-api URL
config['API_URL'] = environ.get('API_URL', 'http://localhost:5050')

config['GOOGLE_API_KEY'] = environ.get('GOOGLE_API_KEY', '')