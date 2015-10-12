/**
Copyright © 2015 Luis Sieira Garcia

This file is part of Planète.

    Planète is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Planète is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with along with planète.  If not, see <http://www.gnu.org/licenses/>.  If not, see <http://www.gnu.org/licenses/>
**/
'use strict';

var angularInjections = angularInjections || [];

angular
.module('planete', [].concat(angularInjections))
.config(function($provide) {
  // register the interceptor as a service
  $provide.factory('authInterceptor', function($q, $log) {
    return {
      // optional method
     'requestError': function(rejection) {
        $log.debug('requestError');
        if (canRecover(rejection)) {
          return 'responseOrNewPromise'
        }
        return $q.reject(rejection);
      },
      // optional method
     'responseError': function(rejection) {
        // do something on error
        $log.debug('responseError');
        if (canRecover(rejection)) {
          return 'responseOrNewPromise'
        }
        return $q.reject(rejection);
      }
    };
  });

/*  $httpProvider.interceptors.push('myHttpInterceptor');

// alternatively, register the interceptor via an anonymous factory
$httpProvider.interceptors.push(function($q, dependency1, dependency2) {
  return {
   'request': function(config) {
       // same as above
    },
      'response': function(response) {
       // same as above
    }
  };
});*/

})
.controller('planeteController', function($scope, $uibModal, $log) {
  $scope.login = function() {
    var dialogOpts = {
      animation: true,
      templateUrl: '/login'
    }
    //Ouverture de la fenêtre
    $uibModal.open(dialogOpts).result
    .then(function (selected) {
      $scope.selected = selected;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});
