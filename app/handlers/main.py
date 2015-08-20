#!/usr/bin/env python
# coding: utf-8

from handlers.base import BaseHandler

class MainHandler(BaseHandler):
    def get(self):
        self.render('main.html')
