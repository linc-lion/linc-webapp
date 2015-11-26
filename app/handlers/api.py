#!/usr/bin/env python
# coding: utf-8

from tornado.web import asynchronous,authenticated
from tornado.gen import engine,coroutine,Task
from handlers.base import BaseHandler
import hmac, hashlib
from os.path import realpath,dirname
from os import remove,mkdir,chdir,curdir
from base64 import b64encode as convertImage
from json import loads,dumps
import logging
from uuid import uuid4 as uid
import urllib
from zipfile import ZipFile
from shutil import rmtree
from datetime import datetime,timedelta

class ImageSetsListHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self):
        resource_url = '/imagesets/list'
        url = self.settings['API_URL']+resource_url
        response = yield Task(self.api,url=url,method='GET')
        self.set_status(response.code)
        self.set_json_output()
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
        self.set_json_output()
        self.finish(response.body)

class LionsListHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self):
        resource_url = '/lions/list'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.set_json_output()
        self.finish(response.body)

class LionsHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self, lions_id='', locations=None):
        resource_url = '/lions/' + lions_id
        api=self.get_argument('api', '')
        if(api):
            resource_url = '/lions?api=true'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.set_json_output()
        self.finish(response.body)
    @asynchronous
    @engine
    def post(self):
        resource_url = '/lions'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='POST',body=self.json_encode(self.input_data))
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to create new lion POST'})
    @asynchronous
    @coroutine
    def put(self, lions_id=None):
        print(lions_id)
        if lions_id:
            resource_url = '/lions/' + lions_id
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
                self.finish({'status':'error','message':'fail to save lion data'})
        else:
            self.set_status(400)
            self.finish({'status':'error','message':'you need provide an lion id PUT'})
    @asynchronous
    @coroutine
    def delete(self, lions_id=None):
        resource_url = '/lions/' + lions_id
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='DELETE',body=self.json_encode({"message":"delete lion"}))
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to delete lion DELETE'})

class ImageSetsHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self, imagesets_id=None, param=None):
        print(param)
        resource_url = '/imagesets/' + imagesets_id
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.set_json_output()
        self.finish(response.body)
    @asynchronous
    @engine
    def post(self):
        resource_url = '/imagesets'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='POST',body=self.json_encode(self.input_data))
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to create new imageset POST'})
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
    @asynchronous
    @coroutine
    def delete(self, imageset_id=None):
        resource_url = '/imagesets/' + imageset_id
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='DELETE',body=self.json_encode({"message":"delete imageset"}))
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to delete imageset DELETE'})

class OrganizationsHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self, organizations_id=None):
        resource_url = '/organizations/' + organizations_id
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.set_json_output()
        self.finish(response.body)
    @asynchronous
    @engine
    def post(self):
        resource_url = '/organizations'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='POST',body=self.json_encode(self.input_data))
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to create new organization POST'})
    @asynchronous
    @coroutine
    def put(self, organizations_id=None):
        print(organizations_id)
        if organizations_id:
            resource_url = '/organizations/' + organizations_id
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
                self.finish({'status':'error','message':'fail to save organization data'})
        else:
            self.set_status(400)
            self.finish({'status':'error','message':'you need provide an organization id PUT'})

class OrganizationsListHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self):
        resource_url = '/organizations/list'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.set_json_output()
        self.finish(response.body)

class ImagesUploadHandler(BaseHandler):
    @asynchronous
    @engine
    def post(self):
        if self.request.files:
            fileinfo = self.request.files['file'][0]
            body = fileinfo['body'];
            fname = fileinfo['filename']
            dirfs= dirname(realpath(__file__))
            fh = open(dirfs+'/'+fname, 'wb')
            fh.write(body)
            fh.close()
            with open(dirfs+'/'+fname, "rb") as imageFile:
                fileencoded = convertImage(imageFile.read())
            if fileencoded:
                remove(dirfs+'/'+fname)
                image_type = self.get_argument("image_type","cv")
                is_public = self.get_argument("is_public",True)
                image_set_id = self.get_argument("image_set_id")
                iscover = self.get_argument("iscover",False)
                body = {
                    "image_type" : image_type,
                    "is_public" : is_public,
                    "image_set_id" : int(image_set_id)
                }
                logging.info(body)
                body["image"] = fileencoded
                resource_url = '/images/upload'
                response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='POST',body=self.json_encode(body))
                if response.code == 200:
                    msg = 'new image uploaded with success.'
                    if iscover:
                        respdata = loads(response.body)
                        imgset_id = respdata['data']['image_set_id']
                        newimg_id = respdata['data']['id']
                        resource_url = '/imagesets/'+str(imgset_id)
                        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,\
                            method='PUT',body=self.json_encode({'main_image_id':newimg_id}))
                        if response.code == 200:
                            msg = msg + 'new image '+str(newimg_id)+' defined as main_image of the imageset '+str(imgset_id)+'.'
                    logging.info('\n\n'+msg)
                    self.setSuccess(201,msg)
                else:
                    self.dropError(500,'fail to upload image')

def remove_file(sched,fn,jid):
    remove(fn)

class ImagesHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self, images_id=None):
        download = self.get_argument('download')
        if download:
            resource_url = '/images?download=' + download
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
            if response and response.code == 200:
                respdata = loads(response.body)
                links = respdata['data']
                folder = self.settings['static_path']+'/'+str(uid())
                mkdir(folder)
                for link in links:
                    print('Downloading: '+link)
                    urllib.urlretrieve(link,folder+'/'+link.split('/')[-1])
                curpath = dirname(realpath(curdir))
                chdir(folder)
                print('Creating zip file: '+folder+'.zip')
                with ZipFile(folder+'.zip', 'w') as myzip:
                    for link in links:
                        myzip.write(link.split('/')[-1])
                chdir(curpath)
                rmtree(folder)
                dtexec = datetime.now() + timedelta(hours=1)
                jobid = str(uid())
                self.settings['scheduler'].add_job(remove_file,trigger='date',name='Remove file '+folder+'.zip at '+str(dtexec),run_date=dtexec,args=[self.settings['scheduler'],folder+'.zip',jobid],coalesce=True,id=jobid)
                self.set_header('Content-Type', 'application/octet-stream')
                self.set_header('Content-Disposition', 'attachment; filename=' + folder.split('/')[-1]+'.zip')
                with open(folder+'.zip', 'r') as f:
                    self.write(f.read())
                self.finish()
            else:
                self.dropError(500,'fail to get urls to download the images')
                return
        else:
            resource_url = '/images/' + images_id
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
            self.set_status(response.code)
            self.set_json_output()
            self.finish(response.body)

    @asynchronous
    @coroutine
    def delete(self, images_id=None):
        resource_url = '/images/' + images_id
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='DELETE',body=self.json_encode({"message":"delete image"}))
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to delete image DELETE'})
    @asynchronous
    @coroutine
    def put(self, images_id=None):
        print(images_id)
        if images_id:
            resource_url = '/images/' + images_id
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
                self.finish({'status':'error','message':'fail to save images data'})
        else:
            self.set_status(400)
            self.finish({'status':'error','message':'you need provide an images id PUT'})

class LoginHandler(BaseHandler):
    @authenticated
    def get(self):
        self.redirect('/#/home',permanent=True)

    @asynchronous
    @engine
    def post(self):
        if self.input_data['username'] and self.input_data['password']:
            obj = {'username':self.input_data['username'],'orgname':'Org Test','admin':False,'token':''}
            self.set_secure_cookie("userlogin",dumps(obj))
            # this will be acquired with the api
            self.setSuccess(200,'You are now logged in the website.',obj)
        else:
            self.dropError(401,'Invalid request, you must provide username and password to login.')

class LogoutHandler(BaseHandler):
    @authenticated
    def post(self):
        self.clear_cookie("userlogin")
        self.setSuccess(200,'logout ok')

    @authenticated
    def get(self):
        pass

class UsersHandler(BaseHandler):
    @asynchronous
    @engine
    def get(self):
        resource_url = '/users'
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET')
        self.set_status(response.code)
        self.set_json_output()
        self.finish(response.body)
    # @asynchronous
    # @engine
    # def post(self):
    #     resource_url = '/lions'
    #     response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='POST',body=self.json_encode(self.input_data))
    #     self.set_status(response.code)
    #     if response.code == 200:
    #         self.finish(response.body)
    #     else:
    #         self.finish({'status':'error','message':'fail to create new lion POST'})
    # @asynchronous
    # @coroutine
    # def put(self, lions_id=None):
    #     print(lions_id)
    #     if lions_id:
    #         resource_url = '/lions/' + lions_id
    #         print(self.input_data)
    #         data = dict(self.input_data)
    #         if "_xsrf" in data.keys():
    #             del data["_xsrf"]
    #         print(data)
    #         response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='PUT',body=self.json_encode(data))
    #         self.set_status(response.code)
    #         if response.code == 200:
    #             self.finish(response.body)
    #         else:
    #             self.finish({'status':'error','message':'fail to save lion data'})
    #     else:
    #         self.set_status(400)
    #         self.finish({'status':'error','message':'you need provide an lion id PUT'})
    # @asynchronous
    # @coroutine
    # def delete(self, lions_id=None):
    #     resource_url = '/lions/' + lions_id
    #     response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='DELETE',body=self.json_encode({"message":"delete lion"}))
    #     self.set_status(response.code)
    #     if response.code == 200:
    #         self.finish(response.body)
    #     else:
    #         self.finish({'status':'error','message':'fail to delete lion DELETE'})
