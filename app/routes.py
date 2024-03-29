#!/usr/bin/env python
# coding: utf-8

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

from handlers.base import VersionHandler
from handlers.auth import LogoutHandler, LoginHandler, CheckAuthHandler, ChangePassword, AgreementAuthHandler,\
    RequestAccessEmailHandler, RecoveryHandler
from handlers.main import MainHandler, RecoveryMainHandler, LoginMainHandler, HomeHandler, SideMenuHandler, \
    RelativesTplHandler, CarouselGalleryHandler, AutoUploadImagesHandler, AutoCropperEditorHandler, \
    AutoCropperDisplay
from handlers.main import LionMainHandler, ViewLionDatabaseHandler, ImageSetMainHandler, ViewImageSetsHandler, BoundaryMapHandler
from handlers.main import ConservationistsHandler, ImageGalleryHandler, LocationHistoryHandler, ViewImagesHandler, CompareImagesHandler
from handlers.main import EditMetadataHandler, CVResultsMainHandler, CVRequestMainHandler, UploadImagesHandler,UploadImagesOptionsHandler, VerifyImageSetHandler
from handlers.main import PageAdminHandler, PageAdminUsersHandler, PageAdminOrganizationsHandler, PageAdminLionsHandler
from handlers.main import PageAdminImageSetsHandler, PageAdminImagesHandler, PageAdminCVRequestsHandler, PageAdminCVResultsHandler
from handlers.main import RequestAccessHandler, MetadataBatchHandler, LocationOnMapHandler, DeleteBatchHandler, SelectBoundarysHandler
from handlers.main import ClassifierGraphHandler, AgreementHandler, TermsOfUseHandler, PrivacyPolicyHandler
from handlers.api import LionsListHandler, ImagesListHandler, ImageSetsListHandler, OrganizationsListHandler, \
    ImageSetsReqHandler, AutoCropperHandler, AutoCropperUploaderHandler
from handlers.api import ImagesUploadHandler, ImagesHandler, LionsHandler, ImageSetsHandler
from handlers.api import ImagesUploadVOCHandler, ImagesVocHandler, VocHandler
from handlers.api import OrganizationsHandler, CVResultsHandler, CVRequestHandler, UsersHandler, RelativesHandler
from handlers.data_export import DataExportHandler


# Defining routes
url_patterns = [
    # Handlers for the website
    (r"/", MainHandler),
    (r"/version", VersionHandler),
    (r"/admin.html", PageAdminHandler),
    (r"/admin.users.tpl.html", PageAdminUsersHandler),
    (r"/admin.organizations.tpl.html", PageAdminOrganizationsHandler),
    (r"/admin.lions.tpl.html", PageAdminLionsHandler),
    (r"/admin.imagesets.tpl.html", PageAdminImageSetsHandler),
    (r"/admin.images.tpl.html", PageAdminImagesHandler),
    (r"/admin.cvrequests.tpl.html", PageAdminCVRequestsHandler),
    (r"/admin.cvresults.tpl.html", PageAdminCVResultsHandler),
    (r"/login.html", LoginMainHandler),
    (r"/recovery.html", RecoveryMainHandler),
    (r"/home.html", HomeHandler),
    (r"/sidemenu.html", SideMenuHandler),
    (r"/lion.html", LionMainHandler),
    (r"/view.lion.database.html", ViewLionDatabaseHandler),
    (r"/imageset.html", ImageSetMainHandler),
    (r"/view.imagesets.html", ViewImageSetsHandler),
    (r"/conservationists.html", ConservationistsHandler),
    (r"/image.gallery.html", ImageGalleryHandler),
    (r"/location.history.html", LocationHistoryHandler),
    (r"/metadata.html", EditMetadataHandler),
    (r"/cvresults.html", CVResultsMainHandler),
    (r"/cvrequest.html", CVRequestMainHandler),
    (r"/uploadimages.html", UploadImagesHandler),
    (r"/uploadimagesoptions.html", UploadImagesOptionsHandler),
    (r"/autocropperuploadimages.html", AutoUploadImagesHandler),
    (r"/autocroppereditor.html", AutoCropperEditorHandler),
    (r"/autocropperdisplay.html", AutoCropperDisplay),

    (r"/verify_imageset.tpl.html", VerifyImageSetHandler),
    (r"/view.images.html", ViewImagesHandler),
    (r"/compare.images.html", CompareImagesHandler),
    (r"/boundary.map.tpl.html", BoundaryMapHandler),
    (r"/relatives.tpl.html", RelativesTplHandler),
    (r"/request.access.tpl.html", RequestAccessHandler),
    (r"/metadata.batch.html", MetadataBatchHandler),
    (r"/delete.batch.tpl.html", DeleteBatchHandler),
    (r"/location.on.map.html", LocationOnMapHandler),
    (r"/carousel.gallery.tpl.html", CarouselGalleryHandler),
    (r"/select.boundarys.tpl.html", SelectBoundarysHandler),
    (r"/classifier.graph.tpl.html", ClassifierGraphHandler),
    (r"/agreement.html", AgreementHandler),
    (r"/terms.of.use.html", TermsOfUseHandler),
    (r"/privacy.policy.html", PrivacyPolicyHandler),
    # Handlers for API comunication
    (r"/imagesets/list", ImageSetsListHandler),
    (r"/imagesets/(\w+)/(cvrequest)/?$", ImageSetsListHandler),
    (r"/imagesets/(\w+)/(cvrequirements)/?$", ImageSetsReqHandler),
    (r"/organizations/list/?$", OrganizationsListHandler),

    (r"/images/list/?$", ImagesListHandler),
    (r"/images/upload/?$", ImagesUploadHandler),
    # (r"/images/uploadvoc/?$", ImagesUploadVOCHandler),
    # (r"/images/uploadvoc/(\w+)/?$", ImagesUploadVOCHandler),
    # (r"/images/uploadvoc/?$", ImagesVocHandler),
    # (r"/images/uploadvoc/(\w+)/?$", ImagesVocHandler),
    (r"/images/uploadvoc/?$", VocHandler),
    (r"/images/uploadvoc/(\w+)/?$", VocHandler),

    (r"/images/?$", ImagesHandler),
    (r"/images/(.*)/?$", ImagesHandler),

    (r"/lions/?$", LionsHandler),
    (r"/lions/list/?$", LionsListHandler),
    (r"/lions/(.*)/?$", LionsHandler),
    (r"/lions/(\w+)/(locations)/?$", LionsHandler),
    (r"/imagesets/?$", ImageSetsHandler),
    (r"/imagesets/(.*)/?$", ImageSetsHandler),

    (r"/organizations/?$", OrganizationsHandler),
    (r"/organizations/(.*)/?$", OrganizationsHandler),

    (r"/cvresults/?$", CVResultsHandler),
    (r"/cvresults/(\w+)/?$", CVResultsHandler),
    (r"/cvresults/(\w+)/(list)/?$", CVResultsHandler),

    (r"/data/export/?$", DataExportHandler),

    (r"/relatives/?$", RelativesHandler),
    (r"/relatives/(\w+)/?$", RelativesHandler),
    (r"/relatives/(\w+)/(relatives)/(\w+)/?$", RelativesHandler),

    (r"/cvrequests/?$", CVRequestHandler),
    (r"/cvrequests/(\w+)/?$", CVRequestHandler),
    (r"/login/?$", LoginHandler),
    (r"/logout/?$", LogoutHandler),
    (r"/auth/agree/?$", AgreementAuthHandler),
    (r"/auth/agree/(\w+)/?$", AgreementAuthHandler),
    (r"/auth/check/?$", CheckAuthHandler),
    # (r"/auth/recovery/(.*)/?$", RecoveryHandler),
    (r"/auth/recovery/?$", RecoveryHandler),
    (r"/auth/requestaccess/?$", RequestAccessEmailHandler),
    (r"/auth/changepassword/?$", ChangePassword),
    (r"/users/?$", UsersHandler),
    (r"/users/(.*)/?$", UsersHandler),
    (r"/autocropper", AutoCropperHandler),
    (r"/autocropper/upload/?$", AutoCropperUploaderHandler),

]
