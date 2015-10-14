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
.factory('$login', ['$uibModal', '$log', function($uibModal, $log) {
  var modal;
  var isOpen = false;

  return {
    modal: function () {
      var dialogOpts = {
        animation: true,
        templateUrl: '/login'
      }
      if(!isOpen) {
        modal = $uibModal.open(dialogOpts);
        isOpen = true;
      }
    },
    closeModal: function () {
      modal.close();
      isOpen = false;
    }
  };
}])
.controller('loginController', ['$scope', '$rootScope', 'AUTH_EVENTS', '$auth', '$login', function($scope, $rootScope, AUTH_EVENTS, $auth, $login) {
  $scope.credentials = {
    username: '',
    password: ''
  };

  $scope.login = function(credentials) {
    $auth.login(credentials).then(function (user) {
      delete $scope.error;
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $login.closeModal();
    }, function () {
      $scope.error = 'Wrong user or password';
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };

  $scope.cancel = $login.closeModal;
}]);
