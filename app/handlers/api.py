#!/usr/bin/env python
# coding: utf-8

from tornado.web import asynchronous
from tornado.gen import engine,coroutine,Task
from handlers.base import BaseHandler

class ImageSetsListHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self):
        resource_url = '/imagesets/list'
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
