#!/usr/bin/env python
# coding: utf-8

from tornado.web import asynchronous,authenticated
from tornado.gen import engine,Task
from handlers.base import BaseHandler
from json import dumps,loads

class LoginHandler(BaseHandler):
    @asynchronous
    @engine
    def post(self):
        if self.input_data['username'] and self.input_data['password']:
            username = self.input_data['username']
            password = self.input_data['password']
            # Check authentication with the API
            resource_url = '/auth/login'
            body = {'username':username,
                    'password':password}
            url = self.settings['API_URL']+resource_url
            response = yield Task(self.api,url=url,method='POST',body=self.json_encode(body))
            if response and response.code == 200:
                data = loads(response.body)
                obj = {'username' : username,
                       'orgname' : data['orgname'],
                       'admin' : (data['role']=='admin'),
                       'token' : data['token']
                }
                self.set_secure_cookie("userlogin",dumps(obj))
                # this will be acquired with the api
                self.setSuccess(200,'You are now logged in the website.',obj)
            else:
                self.dropError(500,'Fail to authenticate with API.')
        else:
            self.dropError(401,'Invalid request, you must provide username and password to login.')

class LogoutHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def post(self):
        print(self.current_user)
        resource_url = '/auth/logout'
        url = self.settings['API_URL']+resource_url
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=url,method='POST',body='{}',headers=headers)
        if response and response.code == 200:
            self.clear_cookie("userlogin")
            self.setSuccess(200,'Logout ok.')
        else:
            self.dropError(500,'Fail to logout.')
