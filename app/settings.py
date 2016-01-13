#!/usr/bin/env python
# coding: utf-8

#!/usr/bin/env python
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

import os
import site
import sys
import tornado
import tornado.template
import socket
from sys import executable as pythonbin
from tornado.options import define, options
from handlers.error import ErrorHandler
from apscheduler.schedulers.tornado import TornadoScheduler
from hashlib import sha256
from uuid import uuid1 as uid

# make filepaths relative to settings.
ROOT = os.path.dirname(os.path.abspath(__file__))
path = lambda *a: os.path.join(ROOT, *a)

# save original Python path
old_sys_path = list(sys.path)

# add local packages directories to Python's site-packages path
site.addsitedir(path('handlers'))  # Request handlers

# add local dependencies
if os.path.exists(path('lib')):
    for directory in os.listdir(path('lib')):
        full_path = path('lib/%s' % directory)
        if os.path.isdir(full_path):
            site.addsitedir(full_path)

# move the new items to the front of sys.path
new_sys_path = []
for item in list(sys.path):
    if item not in old_sys_path:
        new_sys_path.append(item)
        sys.path.remove(item)
sys.path[:0] = new_sys_path

# port defined as heroku deploy
define("port",
    default=5000,
    type=int,
    help=("Server port")
    )
define("config",
    default=None,
    help=("Tornado configuration file")
    )
define('debug',
    default=True,
    type=bool,
    help=("Turn on autoreload, log to stderr only")
    )

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

appdir = os.path.dirname(os.path.realpath(__file__))

# config settings
config = {}
config['debug'] = options.debug
config['cookie_secret'] = '0edc26b95b225fa8416c32cd1bebf785b38ab6e242649794aac1aabf44716232'
#sha256(str(uid)).hexdigest()
config['xsrf_cookies'] = True
config['app_path'] = appdir
config['default_handler_class'] = ErrorHandler
config['default_handler_args'] = dict(status_code=404)
config['version'] = 'LINC webapp version 0.1'
config['static_path'] = os.path.join(appdir, "static")
config['template_path'] = os.path.join(appdir, "templates")
config['autoescape'] = None
config['login_url'] = '/#/login'

config['scheduler'] = TornadoScheduler()
config['scheduler'].start()

# # Setting URL
# ENV = os.environ.get("ENVIRONMENT","local")
# if ENV == 'heroku':
#     appurl = 'http://linc-webapp.venidera.net'
#     #newrelic.agent.initialize('newrelic.ini','staging')
# else:
#     #newrelic.agent.initialize(os.path.dirname(appdir)+'/newrelic.ini','staging')
#     appurl = "http://" + str(getHostIp()) + ":" + str(options.port)
appurl = "https://linc-website.herokuapp.com/"
config['url'] = appurl

# Settings for access to linc-api
config['API_URL'] = 'https://linc-api.herokuapp.com'
#config['API_URL'] = 'http://192.168.100.10:5000'
#Deploy test url 'https://linc-api.herokuapp.com'
