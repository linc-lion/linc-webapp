#!/usr/bin/env python
# coding: utf-8

from tornado.web import asynchronous
from tornado.gen import coroutine
from handlers.base import BaseHandler
from tornado.httpclient import AsyncHTTPClient,HTTPRequest
from json import loads

class ImageSetsListHandler(BaseHandler):
    @asynchronous
    @coroutine
    def get(self):

        AsyncHTTPClient.configure("tornado.curl_httpclient.CurlAsyncHTTPClient")
        http_client = AsyncHTTPClient()
        apiurl = self.settings['API_URL']
        method = 'GET'
        resource_url = '/imagesets/list'
        request = HTTPRequest(**{
            'url' : self.settings['API_URL']+resource_url,
            'method' : method
        })
        print(self.settings['API_URL']+resource_url)
        response = yield http_client.fetch(request)

        self.set_status(response.code)
        self.write(response.body)
        self.finish()
