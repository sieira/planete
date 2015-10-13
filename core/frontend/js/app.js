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

var app = angular.module('planete', [].concat(angularInjections))
.config(function($routeProvider, $httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
})
.factory('authInterceptor', function($q, $log, $rootScope) {
  return {
    response: function(response) {
      if (response.status === 401) {
        $log.debug("Response 401");
      }
      return response || $q.when(response);
    },
    responseError: function(rejection) {
      if (rejection.status === 401) {
        $log.debug("Response Error 401",rejection);
        $rootScope.$broadcast('unauthorized');
      }
      return $q.reject(rejection);
    }
  };
})
.controller('planeteController', function($rootScope, $scope, $ocLazyLoad, $http) {
  $scope.login = function() {
    return $ocLazyLoad.load({
      cache: false,
      rerun: true,
      files: ['modules/auth/js/app.js']
    });
  };

  $scope.admin = function() {
    $http({method: 'GET', url: '/admin'});
  }

  $rootScope.$on('unauthorized', function() {
    $scope.login();
  });
});
