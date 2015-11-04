#!/usr/bin/env python
# coding: utf-8

from handlers.base import VersionHandler
from handlers.error import ErrorHandler
from handlers.auth import AuthHandler
from handlers.main import MainHandler,LoginHandler,HomeHandler,SideMenuHandler,\
    LionHandler,SearchLionHandler,ImageSetHandler,SearchImageSetHandler,\
    ConservationistsHandler,ImageGalleryHandler,LocationHistoryHandler,\
    EditMetadataHandler,CVResultsHandler,CVRequestHandler,UploadImagesHandler
from handlers.api import LionsListHandler, ImagesListHandler, ImageSetsListHandler, OrganizationsListHandler, ImagesUploadHandler, LionsHandler, ImageSetsHandler, OrganizationsHandler, CVResultsHandler

# Defining routes
url_patterns = [
    # Handlers for the website
    (r"/", MainHandler),
    (r"/version", VersionHandler),
    (r"/login", LoginHandler),
    (r"/home", HomeHandler),
    (r"/sidemenu", SideMenuHandler),
    (r"/lion", LionHandler),
    (r"/searchlion", SearchLionHandler),
    (r"/imageset", ImageSetHandler),
    (r"/searchimageset", SearchImageSetHandler),
    (r"/conservationists", ConservationistsHandler),
    (r"/imagegallery", ImageGalleryHandler),
    (r"/locationhistory", LocationHistoryHandler),
    (r"/metadata", EditMetadataHandler),
    (r"/cvresults", CVResultsHandler),
    (r"/cvrequest", CVRequestHandler),
    (r"/uploadimages", UploadImagesHandler),
    # Handlers for API comunication
    (r"/imagesets/list", ImageSetsListHandler),
    (r"/imagesets/(\w+)/(cvrequest)$", ImageSetsListHandler),
    (r"/lions/list", LionsListHandler),
    (r"/organizations/list", OrganizationsListHandler),
    (r"/images/list", ImagesListHandler),
    (r"/images/upload", ImagesUploadHandler),

    (r"/lions/?$", LionsHandler),
    (r"/lions/(.*)$", LionsHandler),
    (r"/imagesets/?$", ImageSetsHandler),
    (r"/imagesets/(.*)$", ImageSetsHandler),
    (r"/organizations/?$", OrganizationsHandler),
    (r"/organizations/(.*)$", OrganizationsHandler),

    (r"/cvresults/?$", CVResultsHandler),
    (r"/cvresults/(\w+$)", CVResultsHandler),
    (r"/cvresults/(\w+)/(list)$", CVResultsHandler)
]
