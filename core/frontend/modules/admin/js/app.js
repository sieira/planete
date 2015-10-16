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
.module('admin', [].concat(angularInjections))
.factory('$adminModal', ['$uibModal', '$log', function($uibModal, $log) {
  var modal = {
    isOpen: false
  };

  return {
    pop: function () {
      var dialogOpts = {
        controller: 'adminController',
        backdrop: false,
        animation: true,
        templateUrl: '/admin'
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
.controller('adminController', ['$scope', '$modalInstance', '$adminModal', function($scope, $modalInstance, $adminModal) {
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
