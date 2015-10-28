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

var app = angular

.module('admin.users', [])
.service('users', ['$http', '$log', function ($http) {
  this.retrieve = function (callback) {
    $http({
      method: 'POST',
      url: '/db/get-users',
    })
    .then(function(data) {
      callback(data.data);
    });
  }
}])
.controller('adminUsersController', ['$scope', '$log', '$http', 'users', function($scope, $log, $http, users) {
  $scope.record = {
    status: 'none',
    err: null,
    running: false
  };

  $scope.recordButton = {
    label: 'Next',
    notRunning: 'Next',
    running: 'Registering user...'
  };

  $scope.clearUser = function() {
    $scope.user = {};
    $scope.user.username = null;
    $scope.user.password = null;
    $scope.user.email = null;
    $scope.user.name= null;
    $scope.user.surname= null;
    $scope.step = 0;
  }
  $scope.clearUser();

  $scope.recordUser = function() {
    $scope.record.running = true;
    $scope.recordButton.label = $scope.recordButton.running;

    $http({
      method: 'POST',
      url: '/db/register-user',
      data: $scope.user
    })
    .then(function(response) {
      $scope.clearUser();
      users.retrieve(function (data) {
        $scope.users = data;
        $scope.showList = true;
      });
      $scope.record.running = false;
      $scope.recordButton.label = $scope.recordButton.notRunning;
    }, function(response) {
      $scope.record.running = false;
      $scope.recordButton.label = $scope.recordButton.notRunning;

      $scope.record.status = "error";
      $scope.record.err = {
        message: response.status,
        details: response.data
      }
    });
  };

  $scope.deleteUser = function (user) {
    $http({
      method: 'DELETE',
      url: '/db/user/' + user._id
    })
    .then(function () {
      users.retrieve(function (data) {
        $scope.users = data;
      });
    });
  }

  users.retrieve(function (data) {
    $log.debug(data);
    $scope.users = data;
  });

  $scope.attributes = ['name', 'roles', 'creationDate'];
}])
.directive('equals', ['$log', function($log) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      // watch own value and re-validate on change
      scope.$watch(attrs.ngModel, function() {
        validate();
      });

      // observe the other value and re-validate on change
      attrs.$observe('equals', function (val) {
        validate();
      });

      var validate = function() {
        // values
        var val1 = ngModel.$viewValue;
        var val2 = attrs.equals;

        // set validity
        ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);

      };
    }
  }
}])
.directive('userList', function() {
  return {
    restrict: 'E',
    templateUrl: '/admin/users/user-list'
  };
})
.directive('userData', function() {
  return {
    restrict: 'E',
    templateUrl: '/admin/users/user-data'
  };
})
.directive('newUser', function() {
  return {
    restrict: 'E',
    templateUrl: '/admin/users/new-user'
  };
});
