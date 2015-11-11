#!/usr/bin/env python
# -*- coding: utf-8 -*-

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
    def prepare(self):
        #self.auth_check()
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
    def api(self,url,method,body=None,callback=None):
        AsyncHTTPClient.configure("tornado.curl_httpclient.CurlAsyncHTTPClient")
        http_client = AsyncHTTPClient()
        h = HTTPHeaders({"content-type": "application/json"})
        params={
            'headers' : h,
            'url' : url,
            'method' : method        }
        if method in ['POST','PUT']:
            params['body']=body
        request = HTTPRequest(**params)
        try:
            response = yield http_client.fetch(request)
        except HTTPError as e:
            print("Error: " + str(e.code) + str(e.response))
            response = e
        callback(response)

    def sanitizestr(self,strs):
        txt = "%s%s" % (string.ascii_letters, string.digits)
        return ''.join(c for c in strs if c in txt)

    def json_encode(self,value):
        return dumps(value,default=str).replace("</", "<\\/")

    def set_default_headers(self):
        self.set_header('Content-Type','text/html; charset=UTF-8')
        #self.set_header('Content-Type', 'application/json; charset=UTF-8')

    def write_error(self, status_code, **kwargs):
        self.write({'status':'error','message':'fail to execute request','code':str(status_code)})
        self.finish()

    def auth_check(self):
        # This method depends of the authentication method defined for the project
        pass
        #key = self.get_argument('auth_key',None)
        #if key != self.settings['auth_key']:
        #    self.authfail()

    # http status code returned will be rechecked soon
    def authfail(self):
        self.set_status(401)
        self.write({'status':'fail','message':'authentication failed'})
        self.finish()

    def success(self,message="",data=None,create=False):
        if create:
            self.set_status(201)
        else:
            self.set_status(200)
        output_response = {'status':'success','message':message}
        if data:
            output_response['data'] = data
        self.write(output_response)
        self.finish()

    def data_exists(self,message=""):
        self.set_status(409)
        self.write({"status":"fail", "message":message})
        self.finish()

    def drop_error(self,message=""):
        self.set_status(500)
        self.write({'status':'error', 'message':message})
        self.finish()

    def not_found(self,message=""):
         self.set_status(404)
         self.write({'status':'fail','message':message})
         self.finish()

class VersionHandler(BaseHandler):
    def get(self):
        self.success(message=self.settings['version'])
