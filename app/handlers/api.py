#!/usr/bin/env python
# coding: utf-8

from tornado.web import asynchronous
from tornado.gen import engine,coroutine,Task
from handlers.base import BaseHandler
import base64
import hmac, hashlib

class ImageSetsListHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self):
        resource_url = '/imagesets/list'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.finish(response.body)
    @asynchronous
    @engine
    def post(self, imgset_id=None, cvrequest=None):
        resource_url = '/imagesets/' + imgset_id + '/cvrequest'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='POST',body=self.json_encode(self.input_data))
        self.set_status(response.code)
        self.finish(response.body)

class ImagesListHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self):
        resource_url = '/images/list'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.finish(response.body)

class LionsListHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self):
        resource_url = '/lions/list'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.finish(response.body)

class OrganizationsListHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self):
        resource_url = '/organizations/list'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.finish(response.body)

class ImagesUploadHandler(BaseHandler):
    @asynchronous
    @engine
    def post(self):
        #resource_url = '/organizations/list'
        #response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        #self.set_status(response.code)
        #self.finish(response.body)
        bucket = "linc-test"
        policy_document = {"expiration": "2200-01-01T00:00:00Z",
                           "conditions": [
                                    {"bucket": bucket},
                                     ["starts-with", "$key", "uploads/"],
                                     {"acl": "public"},
                                     {"success_action_redirect": "http://localhost:5080/images/upload"},
                                     ["starts-with", "$Content-Type", "image/jpeg"], #we will check content type
                                    ["content-length-range", 0, 50048576]
                                        ]}
        AWS_SECRET_ACCESS_KEY = "AKIAIIMGBKV4ZZ5F5I2Q,buzX/qIu5LFjpepnxufnaBKrO5Tps/Y1UeE5Ykkp"
        policy = base64.b64encode(policy_document)
        signature = base64.b64encode(hmac.new(AWS_SECRET_ACCESS_KEY, policy, hashlib.sha1).digest())
