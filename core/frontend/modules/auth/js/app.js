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
  loginStarted: 'auth-login-started',
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  loginCancelled: 'auth-login-cancel',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.value('lock', { locked: false,
                 onSuccess: function () {},
                 onCancel: function () {}
})
.service('Session', function () {
  this.create = function (userId, token) {
    this.userId = userId;
    this.token = "Bearer " + token;
  };
  this.destroy = function () {
    delete this.userId;
    delete this.token;
  };
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
})
.run(function($rootScope, $loginModal, AUTH_EVENTS, lock, $log, $location, $window) {
  /*
   * Keep track of route changes so we can go back to the previous one if the login
   * fails or is dismissed
   */
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    var routeData = {};
    routeData.urls = {};

    if(current && current.originalPath){
      routeData.urls.curr = current.originalPath;
    }
    else {
      routeData.urls.curr = '/';
    }

    if(next && next.originalPath){
      routeData.urls.next = next.originalPath;
    }

    $rootScope.urls = routeData.urls;
  });

  /* Lock the interceptor when logging, so it doesn't
   * react to the login itself
   */
  $rootScope.$on(AUTH_EVENTS.loginStarted, function() {
    lock.locked = true;
  });

  // Catch the norAuthenticated event, and open the modal
  $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
    if(!lock.locked) { $loginModal.pop(); }
  });

  // Unlock on success
  $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
    lock.locked = false;
    lock.onSuccess();
  });

  // Unlock on cancel
  $rootScope.$on(AUTH_EVENTS.loginCancelled, function() {
    lock.locked = false;
    lock.onCancel();
  });

  // Reload the current page on logout, so caches are cleared
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
    $window.location.reload();
  });
})
.factory('authInterceptor', function($rootScope, Session, lock, $q, $log, AUTH_EVENTS, $injector, $location) {
  return {
    // Append the authentication headers to every request
    request: function(config) {
      if(Session.token) {
        config.headers.Authorization = Session.token;
      }
      return config || $q.when(config);
    },
    responseError: function(rejection) {
      var deferred = $q.defer();

      if (rejection.status === 401) {
        $log.debug("Response Error 401", rejection.config.url);

        if(!lock.locked) {
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        } else {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          return $q.reject(rejection);
        }

        // Wait until the login succeeds before retrying the request
        lock.onSuccess = function() {
          // Restore the default values
          lock.onSuccess = function () {};
          lock.onCancel = function () {};

          var $http = $injector.get('$http');
          deferred.resolve($http(rejection.config));
        };

        // Reject on login cancel
        lock.onCancel = function() {
          // Restore the default values
          lock.onSuccess = function () {};
          lock.onCancel = function () {};

          // Stay on the current path
          var $http = $injector.get('$http');
          deferred.resolve($location.path($rootScope.urls.curr));
        };
      } else {
        // Pass the rejection if it's another kind of error
        deferred.reject(rejection);
      }

      return deferred.promise;
    }
  };
})
.factory('$auth', function ($rootScope, AUTH_EVENTS, $http, Session, $log) {
  var $auth = {};

  $auth.login = function (credentials, callback) {
    // Make sure the lock is locked (if externally called)
    $rootScope.$broadcast(AUTH_EVENTS.loginStarted);

    return $http
      .post('/authentication/login', credentials)
      .then(function (res) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        Session.create(res.data.userId,
                       res.data.token);
        return callback();
      }, function(res) {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        return callback(AUTH_EVENTS.loginFailed);
      });
  };

  $auth.logout = function () {
    return $http
      .post('/authentication/logout', Session)
      .then(function() {
        Session.destroy();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
      });
  }

  $auth.cancel = function () {
    $rootScope.$broadcast(AUTH_EVENTS.loginCancelled);
  };

  $auth.isAuthenticated = function () {
    return Session && Session.token;
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
.factory('$loginModal', ['$rootScope', '$uibModal', 'lock', 'AUTH_EVENTS', '$log', function($rootScope, $uibModal, lock, AUTH_EVENTS, $log) {
  return {
    pop: function () {
      // Do not pop the login modal if there is login is already being performed
      if(!lock.locked) {
        // Make sure the lock is locked (if externally called)
        $rootScope.$broadcast(AUTH_EVENTS.loginStarted);
        var dialogOpts = {
          controller: 'loginController',
          backdrop: false,
          animation: true,
          templateUrl: '/login',
        }
        $uibModal.open(dialogOpts);
      }
    }
  };
}])
.controller('loginController', ['$scope', '$modalInstance', '$auth', '$log', function($scope, $modalInstance, $auth, $log) {
  $scope.credentials = {
    username: '',
    password: ''
  };

  $scope.login = function(credentials) {
    $auth.login(credentials, function (err) {
      if(err) { $scope.error = 'Wrong user or password'; }
      else {
        delete $scope.error;
        $modalInstance.close();
      }
    });
  };

  $scope.$on('modal.closing', function () {
    $auth.cancel();
  });

  $scope.cancel = $modalInstance.close;
}]);
