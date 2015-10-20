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

.module('admin.users')
.controller('adminUsersController', function() {
  $scope.users = [
    { name: 'Chuck Norris',
      roles: 'God',
      creationDate: '01/01/0001'
    },
    { name: 'Philip J. Fry',
      roles: 'Delivery boy',
      creationDate: '14/08/1974'
    }
  ]
});
