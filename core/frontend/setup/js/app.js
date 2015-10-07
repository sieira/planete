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
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>
**/
'use strict';

var angularInjections = angularInjections || [];

angular.module('setup', [].concat(angularInjections))

.controller('setupController', ['$scope', '$log', function($scope, $log) {
  $scope.user = {};
  $scope.user.username = null;
  $scope.user.password = null;
  $scope.user.name= null;
  $scope.user.surname= null;
  $scope.step = 0;

  $scope.record = {
    status: 'none',
    err: null,
    running: false
  };

  $scope.recordButton = {
    label: 'Next',
    notRunning: 'Next',
    running: 'Recording user on the server...'
  };

  function onError(data, err, type) {
    $scope[type].status = 'error';
    if (data.error && data.error.message && data.error.details) {
      $scope[type].err = data.error;
    } else {
      $scope[type].err = {
        message: err,
        details: data
      };
    }
  }

  $scope.infocomplete = function() {
    return $scope.user.username && $scope.user.password;
  };

  $scope.recordUser = function() {
    $scope.record.running = true;
    $scope.recordButton.label = $scope.recordButton.running;

    $scope.step++;

    $scope.record.running = false;
    $scope.recordButton.label = $scope.recordButton.notRunning;
  };

}]);
