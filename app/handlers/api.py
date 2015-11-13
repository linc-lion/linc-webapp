#!/usr/bin/env python
# coding: utf-8

from tornado.web import asynchronous
from tornado.gen import engine,coroutine,Task
from handlers.base import BaseHandler
import base64
import hmac, hashlib
from base64 import b64encode as convertImage

class ImageSetsListHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self):
        resource_url = '/imagesets/list'
        url = self.settings['API_URL']+resource_url
        response = yield Task(self.api,url=url,method='GET')
        self.set_status(response.code)
        self.finish(response.body)
    @asynchronous
    @engine
    def post(self, imgset_id=None, cvrequest=None):
        resource_url = '/imagesets/' + imgset_id + '/cvrequest'
        body = self.json_encode(self.input_data)
        url = self.settings['API_URL']+resource_url
        response = yield Task(self.api,url=url,method='POST',body=body)
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish(self.json_encode({'status':'error','messagem':'Bad request'}))

class CVResultsHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self, res_id=None, xlist=None):
        resource_url = '/cvresults/'+ res_id + '/list'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.finish(response.body)
    @asynchronous
    @engine
    def post(self):
        resource_url = '/cvresults'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='POST',body=self.json_encode(self.input_data))
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to access the cvresults POST'})
    @asynchronous
    @coroutine
    def put(self, res_id=None):
        resource_url = '/cvresults/' + res_id
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='PUT',body=self.json_encode({"message":"updating resources"}))
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to access the cvresults PUT'})

class CVRequestHandler(BaseHandler):
    @asynchronous
    @coroutine
    def delete(self, req_id=None):
        resource_url = '/cvrequests/' + req_id
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='DELETE',body=self.json_encode({"message":"updating resources"}))
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to delete cvresults (request) DELETE'})

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

class LionsHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self, lions_id=None, locations=None):
        try:
            iid=int(lions_id)
            iid=str(iid) + '/profile'
        except:
            iid= lions_id
        resource_url = '/lions/' + iid
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        if response:
            self.set_status(response.code)
            if response.code == 200:
                self.finish(response.body)
            else:
                self.finish({'status':'error','message':"fail to access lion's profile history GET"})

class ImageSetsHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self, imagesets_id=None, param=None):
        print(param)
        resource_url = '/imagesets/' + imagesets_id
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.finish(response.body)
    @asynchronous
    @coroutine
    def put(self, imageset_id=None):
        if imageset_id:
            resource_url = '/imagesets/' + imageset_id
            print(self.input_data)
            data = dict(self.input_data)
            if "_xsrf" in data.keys():
                del data["_xsrf"]
            print(data)
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='PUT',body=self.json_encode(data))
            self.set_status(response.code)
            if response.code == 200:
                self.finish(response.body)
            else:
                self.finish({'status':'error','message':'fail to save imageset data'})
        else:
            self.set_status(400)
            self.finish({'status':'error','message':'you need provide an imageset id PUT'})

class OrganizationsHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self, organizations_id=None):
        resource_url = '/organizations/' + organizations_id
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
    def post(self):
        fileinfo = self.request.files['file'][0]
        #print("fileinfo is", fileinfo)
        body = fileinfo['body'];
        #print("body is", body)
        fname = fileinfo['filename']
        #print("fname is", fname)
        from os.path import realpath,dirname
        dirfs= dirname(realpath(__file__))
        #print("dirfs is", dirfs)
        fh = open(dirfs+'/'+fname, 'wb')
        fh.write(body)

        #data_body = self.request.body
        #print("data_body is", data_body)
        image_type = self.get_argument("image_type")
        is_public = self.get_argument("is_public")
        image_set_id = self.get_argument("image_set_id")
        iscover = self.get_argument("iscover")
        print('image_type ', image_type)
        print('is_public ', is_public)
        print('image_set_id ', image_set_id)
        print('iscover ', iscover)

        self.finish(dirfs+'/'+fname + " is uploaded!! Check %s folder" % dirfs)

        """
        with open("t.png", "rb") as imageFile:
            str = convertImage(imageFile.read())
            print str
        """

class LoginHandler(BaseHandler):
    @asynchronous
    @engine
    def post(self, input_data=None):
        #print(self.input_data['username'])
        #print(self.input_data['password'])
        if self.input_data['username'] == 'linc-web@venidera.com' and self.input_data['password'] == '123123':
            self.set_status(200)
            self.finish({'id': 1, 'user': {'id': 1, 'name': self.input_data['username'], 'org' : 'Lion Guardians', 'role': 'admin'}})
            #self.finish('Successfully logged')
        else:
            self.set_status(400)
            if self.input_data['username'] != 'linc-web@venidera.com':
                self.finish("There isn't an account for this email")
            else:
                self.finish('Invalid password')
