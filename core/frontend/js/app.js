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

var app = angular.module('planete', [].concat(angularInjections))
.config(['$routeProvider', '$locationProvider', '$ocLazyLoadProvider', function($routeProvider, $locationProvider, $ocLazyLoadProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/', {
    redirectTo: '/index'
  })
  .when('/admin', {
    controller: 'adminController',
    resolve: {
      loadService: ['$ocLazyLoad', '$uibModal', '$templateRequest', '$q', '$location', '$rootScope', function($ocLazyLoad, $uibModal, $templateRequest, $q, $location, $rootScope) {
        return $ocLazyLoad.load('modules/admin/js/app.js')
        .then(function () {
          return $templateRequest('/admin')
        })
        .then(function(tpl) {
          if (tpl) {
            $uibModal.open({
              animation: true,
              template: tpl,
              size: 'lg',
              controller: 'adminController'
            })
            .result
            .then(function() {
              $location.path($rootScope.urls.curr);
            },function() {
              $location.path($rootScope.urls.curr);
            });
          }
          // Always reject the promise so the url does not change
          return $q.reject();
        });
      }]
    }
  })
  .when('/:whatever', {
    template: '<div ng-bind-html="content"></div>',
    controller: ['$scope', 'content', '$log', function ($scope, content, $log) {
      $scope.content = content;
    }],
    resolve: {
      content:  ['$templateRequest', '$route', '$log', '$q', function($templateRequest, $route, $log, $q) {
        var deferred = $q.defer();
        $templateRequest('/content/' + $route.current.params.whatever)
        .then(function (response) {
          var data = JSON.parse(response);

          var output = (data.format === 'md') ? new showdown.Converter().makeHtml(data.body) : data.body;
          deferred.resolve(output);
        });

        return deferred.promise;
      }]
    }
  });
}])
.controller('planeteController', function($scope, $loginModal, $auth, Session) {
  $scope.isAuthenticated = $auth.isAuthenticated;
  $scope.session = Session;

  $scope.login = function () {
    $loginModal.pop();
  };

  $scope.logout = $auth.logout;
});
