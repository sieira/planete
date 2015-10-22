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

  $scope.newUser = function () {
    $scope.user = {};
    $scope.user.username = 'user' + Math.floor(Math.random() * 10000);
    $scope.user.password = 'password';
    $scope.user.email = 'email@mail.com';
    $scope.user.name= 'Name';
    $scope.user.surname= 'Surname';

    $http({
      method: 'POST',
      url: '/db/register-user',
      data: $scope.user
    })
    .then(function () {
      users.retrieve(function (data) {
        $scope.users = data;
      });
    });
  }

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
/*  $scope.users = [
    { name: 'Chuck Norris',
      roles: 'God',
      creationDate: '01/01/0001'
    },
    { name: 'Philip J. Fry',
      roles: 'Delivery boy',
      creationDate: '14/08/1974'
    }
  ]*/

  $scope.attributes = ['name', 'roles', 'creationDate'];
}]);
