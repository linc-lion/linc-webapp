// LINC is an open source shared database and facial recognition 
// system that allows for collaboration in wildlife monitoring.
// Copyright (C) 2016  Wildlifeguardians
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// For more information or to contact visit linclion.org or email tech@linclion.org
'use strict';

angular.module('lion.guardians.notification.factory', [])

.factory('NotificationFactory', function(notify) {

  var icons = { success: 'icon icon-check',
                error: 'icon icon-cross',
                info: 'icon icon-info',
                warning: 'icon icon-warning'
              };
  var classes = { success: 'alert-success',
                  error: 'alert-danger',
                  info: 'alert-info',
                  warning: 'alert-warning'
                };
  var messageTemplate = function(options) {
    var message = '<div class="notify-icon"><span class="' +
        options.icon + '"></span></div><div class="text-left">'+
        '<h4 class="notify-title">'+ options.title + '</h4></div>'+
        '<div class="notify-text">'+ options.message +'</div>';
    return message;
  }

  var notify_dlg = function(data, type) {
    var opt = { icon: icons[type],
                title: data.title,
                message: data.message
              };
    var message = messageTemplate(opt);
    return notify({
      messageTemplate: message,
      classes: classes[type],
      position: data.position,
      duration: data.duration
    });
  };

  return {
    success: function(data) {
      notify_dlg(data, 'success');
    },
    error: function(data) {
      notify_dlg(data, 'error');
    },
    info: function(data) {
      notify_dlg(data, 'info');
    },
    warning: function(data) {
      notify_dlg(data, 'warning');
    }
  };
});

/*  // Exemplo
  // Success
  NotificationFactory.success({
    title: "Succcess", message:'Succcess ao realizar o procedimento.',
    position: "right", // right, left, center
    duration: 3000     // milisecond
  });
  // Error
  NotificationFactory.error({
    title: 'Error', message: 'Erro ao realizar o procedimento',
    position: 'left', // right, left, center
    duration: 10000   // milisecond
  });
  // Info
  NotificationFactory.info({
    title: 'Info', message: 'Informação sobre o procedimento',
    position: 'left',  // right, left, center
    duration: 1000     // milisecond
  });
  // Warning
  NotificationFactory.warning({
    title: 'Warning',
    message: 'Warning ao realizar o procedimento !!',
    position: 'left',  // right, left, center
    duration: 1000     // milisecond
  });
*/
