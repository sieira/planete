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

var modal;

var app = angular
.module('auth', [].concat(angularInjections))
.controller('loginController', ['$scope', function($scope) {
  $scope.ok = function () {
    modal.close('OK');
  };

  $scope.cancel = function () {
    modal.close('cancel');
  };
}])
.run(['$uibModal', '$log', function($uibModal, $log) {
    var dialogOpts = {
      animation: true,
      templateUrl: '/login'
    }

    modal = $uibModal.open(dialogOpts);

    modal.result
    .then(function (selected) {
      alert(selected);
    });
}]);
