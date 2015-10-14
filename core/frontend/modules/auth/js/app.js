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

var app = angular
.module('auth', [].concat(angularInjections))
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
})
.run(function($rootScope, $loginModal, AUTH_EVENTS) {
    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
      return $loginModal.pop();
    });
})
.factory('authInterceptor', function($rootScope, $q, $log, AUTH_EVENTS) {
  return {
    response: function(response) {
      if (response.status === 401) {
        $log.debug("Response 401");
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
      return response || $q.when(response);
    },
    responseError: function(rejection) {
      if (rejection.status === 401) {
        $log.debug("Response Error 401",rejection);
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
      return $q.reject(rejection);
    }
  };
})
.service('Session', function () {
  this.create = function (userId, token) {
    this.userId = userId;
    this.token = token;
  };
  this.destroy = function () {
    delete this.userId;
    delete this.token;
  };
})
.factory('$auth', function ($http, Session, $log) {
  var $auth = {};

  $auth.login = function (credentials) {
    return $http
      .post('/authentication/login', credentials)
      .then(function (res) {
        Session.create(res.data.userId,
                       res.data.token);
        return res.data;
      });
  };

  $auth.isAuthenticated = function () {
    return !!Session.userId;
  };

  $auth.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return ($auth.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };

  return $auth;
})
.factory('$loginModal', ['$uibModal', '$log', function($uibModal, $log) {
  var modal = {
    isOpen: false
  };

  return {
    pop: function () {
      var dialogOpts = {
        controller: 'loginController',
        backdrop: false,
        animation: true,
        templateUrl: '/login'
      }
      if(!modal.isOpen) {
        modal = $uibModal.open(dialogOpts);
        modal.isOpen = true;
      }
    },
    close: function () {
      modal.close();
    }
  };
}])
.controller('loginController', ['$scope', '$rootScope', '$modalInstance', 'AUTH_EVENTS', '$auth', '$loginModal', function($scope, $rootScope, $modalInstance, AUTH_EVENTS, $auth, $loginModal) {
  $scope.credentials = {
    username: '',
    password: ''
  };

  $scope.login = function(credentials) {
    $auth.login(credentials).then(function (user) {
      delete $scope.error;
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $loginModal.close();
    }, function () {
      $scope.error = 'Wrong user or password';
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };

  $scope.$on('modal.closing', function () {
    $modalInstance.isOpen = false;
  });

  $scope.cancel = $loginModal.close;
}]);
