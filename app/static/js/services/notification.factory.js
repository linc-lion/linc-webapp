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
