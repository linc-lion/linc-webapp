#!/usr/bin/env python
# -*- coding: utf-8 -*-

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

from json import load,loads,dumps,dump
from tornado.web import RequestHandler,asynchronous
from tornado.gen import engine,coroutine
import string,os
from tornado.httpclient import AsyncHTTPClient,HTTPRequest,HTTPError
from tornado.httputil import HTTPHeaders

class BaseHandler(RequestHandler):
    """A class to collect common handler methods - all other handlers should
    inherit this one.
    """
    def get_current_user(self):
        cookieinfo = self.get_secure_cookie("userlogin")
        if cookieinfo:
            cookieinfo = loads(cookieinfo)
        return cookieinfo

    def prepare(self):
        self.input_data = dict()
        if self.request.method in ['POST','PUT'] and \
           self.request.headers["Content-Type"].startswith("application/json"):
            try:
                if self.request.body:
                    self.input_data = loads(self.request.body.decode("utf-8"))
                for k,v in self.request.arguments.items():
                    if str(k) != str(self.request.body.decode("utf-8")):
                        self.input_data[k] = v[0].decode("utf-8")
            except ValueError:
                self.dropError(400,'Fail to parse input data.')

    @asynchronous
    @engine
    def api(self,url,method,body=None,headers=None,callback=None):
        AsyncHTTPClient.configure("tornado.curl_httpclient.CurlAsyncHTTPClient")
        http_client = AsyncHTTPClient()
        dictheaders = {"content-type": "application/json"}
        if headers:
            for k,v in headers.iteritems():
                dictheaders[k] = v
        h = HTTPHeaders(dictheaders)
        params={
            'headers' : h,
            'url' : url,
            'method' : method,
            'request_timeout': 720,
            'validate_cert' : False}
        if method in ['POST','PUT']:
            params['body']=body
        request = HTTPRequest(**params)
        try:
            response = yield http_client.fetch(request)
        except HTTPError, e:
            print 'HTTTP error returned... '
            print "Code: ", e.code
            print "Message: ", e.message
            if e.response:
                print 'URL: ', e.response.effective_url
                print 'Reason: ', e.response.reason
                print 'Body: ', e.response.body
                response = e.response
            else:
                response = e
        except Exception as e:
            # Other errors are possible, such as IOError.
            print("Other Errors: " + str(e))
            response = e
        callback(response)

    def setSuccess(self,code=200,message="",data=None):
        output_response = {'status':'success','message':message}
        if data:
            output_response['data'] = loads(self.json_encode(data))
        self.set_status(code)
        self.finish(output_response)

    def dropError(self,code=400,message=""):
        self.set_status(code)
        self.finish({'status':'error', 'message':message})

    def sanitizestr(self,strs):
        txt = "%s%s" % (string.ascii_letters, string.digits)
        return ''.join(c for c in strs if c in txt)

    def json_encode(self,value):
        return dumps(value,default=str).replace("</", "<\\/")

    def set_default_headers(self):
        self.set_header('Content-Type','text/html; charset=UTF-8')

    def set_json_output(self):
        self.set_header('Content-Type', 'application/json; charset=UTF-8')

class VersionHandler(BaseHandler):
    def get(self):
        self.setSuccess(message=self.settings['version'])
