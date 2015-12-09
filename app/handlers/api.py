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
from utils.rolecheck import allowedRole
from tornadoist import ProcessMixin

class ImageSetsListHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self):
        resource_url = '/imagesets/list'
        url = self.settings['API_URL']+resource_url
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=url,method='GET',headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to get Image Set profile'})

    @asynchronous
    @engine
    @authenticated
    def post(self, imageset_id=None, cvrequest=None):
        resource_url = '/imagesets/' + imageset_id + '/cvrequest'
        body = self.json_encode(self.input_data)
        url = self.settings['API_URL']+resource_url
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=url,method='POST',body=body,headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish(self.json_encode({'status':'error','messagem':'Bad request'}))

class ImagesListHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self):
        resource_url = '/images/list'
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to get Images GET'})

class LionsListHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self):
        resource_url = '/lions/list'
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to get Lions GET'})

class OrganizationsListHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self):
        resource_url = '/organizations/list'
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to get Organizations GET'})

class CVResultsHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self, res_id='', xlist=None):
        resource_url = '/cvresults/' + res_id;
        if xlist:
            resource_url += '/' + xlist

        print(resource_url)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to get CV Results GET'})

    @asynchronous
    @engine
    @authenticated
    def post(self):
        resource_url = '/cvresults'
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                   method='POST',body=self.json_encode(self.input_data),headers=headers)
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to access the cvresults POST'})

    @asynchronous
    @coroutine
    @authenticated
    def put(self, res_id=None):
        resource_url = '/cvresults/' + res_id
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
        method='PUT',body=self.json_encode({"message":"updating resources"}),headers=headers)
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to access the cvresults PUT'})

class CVRequestHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self, req_id=''):
        resource_url = '/cvrequests/' + req_id
        print(resource_url)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to get CV Requests GET'})

    @asynchronous
    @coroutine
    @authenticated
    def delete(self, req_id=None):
        resource_url = '/cvrequests/' + req_id
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='DELETE',body=self.json_encode({"message":"updating resources"}))
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to delete cvresults (request) DELETE'})

class LionsHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self, lion_id='', locations=None):
        resource_url = '/lions'
        api=self.get_argument('api', '')
        if lion_id:
            resource_url += '/' + lion_id
            if api:
                resource_url += '?api=true'
        elif api and self.trashed:
            resource_url += '?api=true&trashed=' + str(self.trashed)
        elif api:
            resource_url += '?api=true'
        elif self.trashed:
            resource_url += '?trashed=' + str(self.trashed)
        print(resource_url)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to get Lions GET'})

    @asynchronous
    @engine
    @authenticated
    def post(self):
        resource_url = '/lions'
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url, method='POST',body=self.json_encode(self.input_data),headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to create new lion POST'})

    @asynchronous
    @coroutine
    @authenticated
    def put(self, lion_id=None):
        self.set_json_output()
        if lion_id:
            resource_url = '/lions/' + lion_id
            print(self.input_data)
            data = dict(self.input_data)
            if "_xsrf" in data.keys():
                del data["_xsrf"]
            print(data)
            headers = {'Linc-Api-AuthToken':self.current_user['token']}
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                       method='PUT',body=self.json_encode(data),headers=headers)
            self.set_status(response.code)
            if response.code == 200:
                self.finish(response.body)
            else:
                self.finish({'status':'error','message':'fail to save lion data'})
        else:
            self.set_status(400)
            self.finish({'status':'error','message':'you need to provide an lion id PUT'})

    @asynchronous
    @coroutine
    @authenticated
    def delete(self, lion_id=None):
        purge = self.get_argument('purge','')
        resource_url = '/lions/' + lion_id
        if purge:
            resource_url += '?purge=' + str(purge)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                    method='DELETE',body=self.json_encode({"message":"delete lion"}),headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to delete lion DELETE'})

class ImageSetsHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self, imageset_id='', param=None):
        resource_url = '/imagesets'
        if self.trashed:
            resource_url += '?trashed=' + str(self.trashed)
        elif imageset_id:
            resource_url += '/' + imageset_id
        print(resource_url)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to get Image Sets GET'})

    @asynchronous
    @engine
    @authenticated
    def post(self):
        resource_url = '/imagesets'
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                   method='POST',body=self.json_encode(self.input_data),headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to create new imageset POST'})

    @asynchronous
    @coroutine
    @authenticated
    def put(self, imageset_id=None):
        self.set_json_output()
        if imageset_id:
            resource_url = '/imagesets/' + imageset_id
            print(self.input_data)
            data = dict(self.input_data)
            if "_xsrf" in data.keys():
                del data["_xsrf"]
            print(data)
            headers = {'Linc-Api-AuthToken':self.current_user['token']}
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                       method='PUT',body=self.json_encode(data),headers=headers)
            self.set_status(response.code)
            if response.code == 200:
                self.finish(response.body)
            else:
                self.finish({'status':'error','message':'fail to save imageset data'})
        else:
            self.set_status(400)
            self.finish({'status':'error','message':'you need to provide an imageset id PUT'})

    @asynchronous
    @coroutine
    @authenticated
    def delete(self, imageset_id=None):
        purge = self.get_argument('purge','')
        resource_url = '/imagesets/' + imageset_id
        if purge:
            resource_url += '?purge=' + str(purge)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                   method='DELETE',body=self.json_encode({"message":"delete imageset"}),headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to delete imageset DELETE'})

class OrganizationsHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self, organization_id=''):
        resource_url = '/organizations'
        if self.trashed:
            resource_url += '?trashed=' + str(self.trashed)
        elif organization_id:
            resource_url += '/' + organization_id
        print(resource_url)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to get organizations GET'})

    @asynchronous
    @engine
    @authenticated
    @allowedRole('admin')
    def post(self):
        resource_url = '/organizations'
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                   method='POST',body=self.json_encode(self.input_data),headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to create new organization POST'})

    @asynchronous
    @coroutine
    @authenticated
    @allowedRole('admin')
    def put(self, organization_id=None):
        self.set_json_output()
        if organization_id:
            resource_url = '/organizations/' + organization_id
            data = dict(self.input_data)
            if "_xsrf" in data.keys():
                del data["_xsrf"]
            headers = {'Linc-Api-AuthToken':self.current_user['token']}
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                        method='PUT',body=self.json_encode(data),headers=headers)
            self.set_status(response.code)
            if response.code == 200:
                self.finish(response.body)
            else:
                self.finish({'status':'error','message':'fail to save organization data'})
        else:
            self.set_status(400)
            self.finish({'status':'error','message':'you need to provide an organization id PUT'})

    @asynchronous
    @coroutine
    @authenticated
    def delete(self, organization_id=None):
        purge = self.get_argument('purge','')
        resource_url = '/organizations/' + organization_id
        if purge:
            resource_url += '?purge=' + str(purge)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                   method='DELETE',body=self.json_encode({"message":"delete organization"}),headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to delete organization DELETE'})

class UsersHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self, user_id=''):
        resource_url = '/users/' + user_id
        if self.trashed:
            resource_url += '?trashed=' + str(self.trashed)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to get Users GET'})

    @asynchronous
    @engine
    @authenticated
    @allowedRole('admin')
    def post(self):
        resource_url = '/users'
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                   method='POST',body=self.json_encode(self.input_data),headers=headers)
        self.set_json_output()
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to create new user POST'})

    @asynchronous
    @coroutine
    @authenticated
    @allowedRole('admin')
    def put(self, user_id=None):
        self.set_json_output()
        if user_id:
            resource_url = '/users/' + user_id
            data = dict(self.input_data)
            if "_xsrf" in data.keys():
                del data["_xsrf"]
            headers = {'Linc-Api-AuthToken':self.current_user['token']}
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                        method='PUT',body=self.json_encode(data),headers=headers)
            self.set_status(response.code)
            if response.code == 200:
                self.finish(response.body)
            else:
                self.finish({'status':'error','message':'fail to save user data'})
        else:
            self.set_status(400)
            self.finish({'status':'error','message':'you need to provide an user id PUT'})

    @asynchronous
    @coroutine
    @authenticated
    @allowedRole('admin')
    def delete(self, user_id=None):
        purge = self.get_argument('purge','')
        resource_url = '/users/' + user_id
        if purge:
            resource_url += '?purge=' + str(purge)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                    method='DELETE',body=self.json_encode({"message":"delete user"}),headers=headers)
        self.set_status(response.code)
        self.set_json_output()
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to delete user DELETE'})

class ImagesHandler(BaseHandler):
    @asynchronous
    @engine
    @authenticated
    def get(self, image_id=''):
        self.set_json_output()
        download = self.get_argument('download','')
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        if download:
            resource_url = '/images?download=' + download
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
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
        elif self.trashed:
            resource_url = '/images?trashed=' + str(self.trashed)
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
            self.set_status(response.code)
            if response.code == 200:
                self.finish(response.body)
            else:
                self.finish({'status':'error','message':'fail to get Images GET'})
        else:
            resource_url = '/images/' + image_id
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,method='GET',headers=headers)
            self.set_status(response.code)
            if response.code == 200:
                self.finish(response.body)
            else:
                self.finish({'status':'error','message':'fail to get Images GET'})

    @asynchronous
    @coroutine
    @authenticated
    def put(self, image_id=None):
        self.set_json_output()
        if image_id:
            resource_url = '/images/' + image_id
            print(self.input_data)
            data = dict(self.input_data)
            if "_xsrf" in data.keys():
                del data["_xsrf"]
            print(data)
            headers = {'Linc-Api-AuthToken':self.current_user['token']}
            response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                           method='PUT',body=self.json_encode(data),headers=headers)
            self.set_status(response.code)
            if response.code == 200:
                self.finish(response.body)
            else:
                self.finish({'status':'error','message':'fail to save images data'})
        else:
            self.set_status(400)
            self.finish({'status':'error','message':'you need to provide an images id PUT'})

    @asynchronous
    @coroutine
    @authenticated
    def delete(self, image_id=None):
        purge = self.get_argument('purge','')
        resource_url = '/images/' + image_id
        if purge:
            resource_url += '?purge=' + str(purge)
        headers = {'Linc-Api-AuthToken':self.current_user['token']}
        response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                    method='DELETE',body=self.json_encode({"message":"delete image"}),headers=headers)
        self.set_status(response.code)
        if response.code == 200:
            self.finish(response.body)
        else:
            self.finish({'status':'error','message':'fail to delete image DELETE'})

class ImagesUploadHandler(BaseHandler, ProcessMixin):
    @asynchronous
    @engine
    @authenticated
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
                is_public = self.get_argument("is_public",'')
                is_public = (is_public.lower() == 'true')
                image_set_id = self.get_argument("image_set_id")
                iscover = self.get_argument("iscover",'')
                iscover = (iscover.lower() == 'true')
                body = {
                    "image_type" : image_type,
                    "is_public" : is_public,
                    "image_set_id" : int(image_set_id),
                    "iscover" : iscover
                }
                logging.info(body)
                body["image"] = fileencoded
                resource_url = '/images/upload'
                headers = {'Linc-Api-AuthToken':self.current_user['token']}
                response = yield Task(self.api,url=self.settings['API_URL']+resource_url,
                              method='POST',body=self.json_encode(body),headers=headers)
                if response.code in [200,201]:
                    self.setSuccess(200,'File successfully uploaded. You must wait the processing phase for your image.')
                elif response.code == 409:
                    self.dropError(response.code,'The file already exists in the system.')
                elif response.code == 400:
                    self.dropError(response.code,'The data or file sent is invalid to add the image in the system.')
                else:
                    self.dropError(500,'Fail to upload image')
        else:
            self.dropError(400,'Please send a file to upload.')

def remove_file(sched,fn,jid):
    remove(fn)
