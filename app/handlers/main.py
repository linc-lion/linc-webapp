#!/usr/bin/env python
# coding: utf-8

from handlers.base import BaseHandler

class MainHandler(BaseHandler):
    def get(self):
        self.render('main.html')

class LoginHandler(BaseHandler):
    def get(self):
        self.render('login.html')

class HomeHandler(BaseHandler):
    def get(self):
        self.render('home.html')

class SideMenuHandler(BaseHandler):
    def get(self):
        self.render('side_menu.html')

class LionHandler(BaseHandler):
    def get(self):
        self.render('lion.html')

class SearchLionHandler(BaseHandler):
    def get(self):
        self.render('search_lion.html')

class ImageSetHandler(BaseHandler):
    def get(self):
        self.render('image_set.html')

class SearchImageSetHandler(BaseHandler):
    def get(self):
        self.render('search_image_set.html')

class ConservationistsHandler(BaseHandler):
    def get(self):
        self.render('conservationists.html')

class ImageGalleryHandler(BaseHandler):
    def get(self):
        self.render('image_gallery.html')

class LocationHistoryHandler(BaseHandler):
    def get(self):
        self.render('location_history.html')

class EditMetadataHandler(BaseHandler):
    def get(self):
        self.render('metadata.html')

class CVResultsHandler(BaseHandler):
    def get(self):
        self.render('cv_results.html')

class CVRequestHandler(BaseHandler):
    def get(self):
        self.render('cv_request.html')

class UploadImagesHandler(BaseHandler):
    def get(self):
        self.render('upload_images.html')
