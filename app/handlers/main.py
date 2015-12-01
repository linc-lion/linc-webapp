#!/usr/bin/env python
# coding: utf-8

from handlers.base import BaseHandler
from tornado.web import authenticated
from utils.rolecheck import allowedRole

class MainHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('main.html')

class LoginMainHandler(BaseHandler):
    def get(self):
        self.render('login.html',xsrf=self.xsrf_token)

class HomeHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('home.html')

class SideMenuHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('side_menu.html',username=self.current_user['username'],\
                orgname=self.current_user['orgname'],admin=self.current_user['admin'])

class LionMainHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('lion.html')

class SearchLionHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('search_lion.html')

class ImageSetMainHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('image_set.html')

class SearchImageSetHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('search_image_set.html')

class ConservationistsHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('conservationists.html')

class ImageGalleryHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('image_gallery.html')

class LocationHistoryHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('location_history.html')

class EditMetadataHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('metadata.html')

class CVResultsMainHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('cv_results.html')

class CVRequestMainHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('cv_request.html')

class UploadImagesHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('upload_images.html')

class PageAdminHandler(BaseHandler):
    @authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.html')

class PageAdminUsersHandler(BaseHandler):
    @authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.users.tpl.html')

class PageAdminOrganizationsHandler(BaseHandler):
    @authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.organizations.tpl.html')

class PageAdminLionsHandler(BaseHandler):
    @authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.lions.tpl.html')

class PageAdminImageSetsHandler(BaseHandler):
    @authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.imagesets.tpl.html')

class PageAdminImagesHandler(BaseHandler):
    @authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.images.tpl.html')

class PageAdminCVRequestsHandler(BaseHandler):
    @authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.cvrequests.tpl.html')

class PageAdminCVResultsHandler(BaseHandler):
    @authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.cvresults.tpl.html')
