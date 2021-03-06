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
.module('admin.content', [])
.service('content', ['$http', function ($http) {
  this.retrieve = function (callback) {
    $http({
      method: 'POST',
      url: '/db/get-content',
    })
    .then(function(data) {
      callback(data.data);
    });
  }
}])
.controller('adminContentController', ['$scope', '$log', '$http', 'content', function($scope, $log, $http, content) {
  $scope.record = {
    status: 'none',
    err: null,
    running: false
  };

  $scope.recordButton = {
    label: 'Next',
    notRunning: 'Next',
    running: 'Registering content...'
  };

  $scope.clearContent = function() {
    $scope.content = {};
    $scope.step = 0;
  }
  $scope.clearContent();

  $scope.recordContent = function() {
    $scope.record.running = true;
    $scope.recordButton.label = $scope.recordButton.running;

    $http({
      method: 'POST',
      url: '/db/register-content',
      data: $scope.content
    })
    .then(function(response) {
      $scope.clearContent();
      content.retrieve(function (data) {
        $scope.content = data;
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
  $scope.editContent = function (content) {
    alert('not implemented');
  };

  $scope.deleteContent = function (content) {
    $http({
      method: 'DELETE',
      url: '/db/content/' + content._id
    })
    .then(function () {
      content.retrieve(function (data) {
        $scope.conent = data;
      });
    });
  }

  content.retrieve(function (data) {
    $scope.content = data;
  });

  $scope.attributes = ['title', 'creationDate'];
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
.directive('contentList', function() {
  return {
    restrict: 'E',
    templateUrl: '/admin/content/content-list'
  };
})
.directive('contentData', function() {
  return {
    restrict: 'A',
    templateUrl: '/admin/content/content-data'
  };
})
.directive('newContent', function() {
  return {
    restrict: 'E',
    templateUrl: '/admin/content/new-content'
  };
});
