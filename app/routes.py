#!/usr/bin/env python
# coding: utf-8

from handlers.base import VersionHandler
from handlers.error import ErrorHandler
from handlers.auth import AuthHandler
from handlers.main import MainHandler
from handlers.main import MenuHandler
from handlers.main import SideMenuHandler
from handlers.main import NewLionHandler
from handlers.main import SearchLionHandler
from handlers.main import NewImageSetHandler
from handlers.main import SearchImageSetHandler
from handlers.main import ConservationistsHandler
from handlers.main import ImageGalleryHandler
from handlers.main import LocationHistoryHandler
from handlers.main import EditMetadataHandler
from handlers.main import CVResultsHandler
from handlers.main import CVRefineHandler

# Defining routes
url_patterns = [
    #(r"/auth/", AuthHandler),
    #(r"/auth/(?P<id>[a-zA-Z0-9_]+)/?$", AuthQueryHandler),
    #(r"/signal/", xHandler),
    #(r"/signal/(.*)", yHandler),
    (r"/version", VersionHandler),
    (r"/menu", MenuHandler),
    (r"/sidemenu", SideMenuHandler),
    (r"/newlion", NewLionHandler),
    (r"/searchlion", SearchLionHandler),
    (r"/newimageset", NewImageSetHandler),
    (r"/searchimageset", SearchImageSetHandler),
    (r"/conservationists", ConservationistsHandler),
    (r"/imagegallery", ImageGalleryHandler),
    (r"/map", LocationHistoryHandler),
    (r"/metadata", EditMetadataHandler),
    (r"/cvresults", CVResultsHandler),
    (r"/cvrefine", CVRefineHandler),
    (r"/", MainHandler)
]
