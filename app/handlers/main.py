#!/usr/bin/env python
# coding: utf-8

from handlers.base import BaseHandler

class MainHandler(BaseHandler):
    def get(self):
        self.render('main.html')

class MenuHandler(BaseHandler):
    def get(self):
        self.render('menu.html')

class SideMenuHandler(BaseHandler):
    def get(self):
        self.render('side_menu.html')

class NewLionHandler(BaseHandler):
    def get(self):
        self.render('new_lion.html')

class SearchLionHandler(BaseHandler):
    def get(self):
        self.render('search_lion.html')

class NewImageSetHandler(BaseHandler):
    def get(self):
        self.render('new_image_set.html')

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
        self.render('map.html')

class EditMetadataHandler(BaseHandler):
    def get(self):
        self.render('metadata.html')

class CVResultsHandler(BaseHandler):
    def get(self):
        self.render('cv_results.html')

class CVRefineHandler(BaseHandler):
    def get(self):
        self.render('cv_refine.html')
