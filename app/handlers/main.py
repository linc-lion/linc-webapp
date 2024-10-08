#!/usr/bin/env python3.6
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

from handlers.base import BaseHandler
from lib.authentication import web_authenticated
from utils.rolecheck import allowedRole


class MainHandler(BaseHandler):
    def get(self):
        self.render('main.html')


class LoginMainHandler(BaseHandler):
    def get(self):
        self.render('login.html', xsrf=self.xsrf_token)

class RecoveryMainHandler(BaseHandler):
    def get(self):
        self.render('recovery.html', xsrf=self.xsrf_token)

class RequestAccessHandler(BaseHandler):
    def get(self):
        self.render('request.access.tpl.html', xsrf=self.xsrf_token)


class HomeHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('home.html')


class SideMenuHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render(
            'side_menu.html',
            username=self.current_user['username'],
            orgname=self.current_user['orgname'],
            admin=self.current_user['admin'])


class LionMainHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('lion.html')


class ViewLionDatabaseHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('view.lion.database.html')


class ImageSetMainHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('imageset.html')


class ViewImageSetsHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('view.imagesets.html')


class ConservationistsHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('conservationists.html')


class ImageGalleryHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('image.gallery.html')


class LocationHistoryHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('location.history.html')


class EditMetadataHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('metadata.html')


class CVResultsMainHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('cv_results.html')


class CVRequestMainHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('cv_request.html')


class UploadImagesOptionsHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('upload_image_options.html')


class AutoUploadImagesHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('autocropper_upload_images.html')


class AutoCropperEditorHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('autocropper_editor.html')


class AutoCropperDisplay(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('autocropper_display.html')


class UploadImagesHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('upload_images.html')


class VerifyImageSetHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('verify_imageset.tpl.html')


class PageAdminHandler(BaseHandler):
    @web_authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.html')


class PageAdminUsersHandler(BaseHandler):
    @web_authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.users.tpl.html')


class PageAdminOrganizationsHandler(BaseHandler):
    @web_authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.organizations.tpl.html')


class PageAdminLionsHandler(BaseHandler):
    @web_authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.lions.tpl.html')


class PageAdminImageSetsHandler(BaseHandler):
    @web_authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.imagesets.tpl.html')


class PageAdminImagesHandler(BaseHandler):
    @web_authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.images.tpl.html')


class PageAdminCVRequestsHandler(BaseHandler):
    @web_authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.cvrequests.tpl.html')


class PageAdminCVResultsHandler(BaseHandler):
    @web_authenticated
    @allowedRole('admin')
    def get(self):
        self.render('admin.cvresults.tpl.html')


class ViewImagesHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('view.images.html')


class CompareImagesHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('compare.images.html')


class BoundaryMapHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('boundary.map.tpl.html')


class RelativesTplHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('relatives.tpl.html')


class MetadataBatchHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('metadata.batch.html')


class LocationOnMapHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('location.on.map.tpl.html')


class DeleteBatchHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('delete.batch.tpl.html')


class CarouselGalleryHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('carousel.gallery.tpl.html')


class SelectBoundarysHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('select.boundarys.tpl.html')


class ClassifierGraphHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('classifier.graph.tpl.html')


class AgreementHandler(BaseHandler):
    def get(self):
        self.render('agreement.html')


class TermsOfUseHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('terms.of.use.html')


class PrivacyPolicyHandler(BaseHandler):
    @web_authenticated
    def get(self):
        self.render('privacy.policy.html')
