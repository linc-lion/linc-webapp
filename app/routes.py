#!/usr/bin/env python
# coding: utf-8

from handlers.base import VersionHandler
from handlers.error import ErrorHandler
from handlers.auth import AuthHandler
from handlers.main import MainHandler,LoginHandler,HomeHandler,SideMenuHandler,\
    NewLionHandler,SearchLionHandler,NewImageSetHandler,SearchImageSetHandler,\
    ConservationistsHandler,ImageGalleryHandler,LocationHistoryHandler,\
    EditMetadataHandler,CVResultsHandler,CVRefineHandler,UploadImagesHandler
from handlers.api import LionsListHandler, ImagesListHandler, ImageSetsListHandler, OrganizationsListHandler, ImagesUploadHandler

# Defining routes
url_patterns = [
    # Handlers for the website
    (r"/", MainHandler),
    (r"/version", VersionHandler),
    (r"/login", LoginHandler),
    (r"/home", HomeHandler),
    (r"/sidemenu", SideMenuHandler),
    (r"/newlion", NewLionHandler),
    (r"/searchlion", SearchLionHandler),
    (r"/newimageset", NewImageSetHandler),
    (r"/searchimageset", SearchImageSetHandler),
    (r"/conservationists", ConservationistsHandler),
    (r"/imagegallery", ImageGalleryHandler),
    (r"/locationhistory", LocationHistoryHandler),
    (r"/metadata", EditMetadataHandler),
    (r"/cvresults", CVResultsHandler),
    (r"/cvrefine", CVRefineHandler),
    (r"/uploadimages", UploadImagesHandler),
    # Handlers for API comunication
    (r"/imagesets/list", ImageSetsListHandler),
    (r"/lions/list", LionsListHandler),
    (r"/organizations/list", OrganizationsListHandler),
    (r"/images/list", ImagesListHandler),
    (r"/images/upload", ImagesUploadHandler)

]
