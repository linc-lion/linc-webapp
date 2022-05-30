// LINC is an open source shared database and facial recognition
// system that allows for collaboration in wildlife monitoring.
// Copyright (C) 2016  Wildlifeguardians
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// For more information or to contact visit linclion.org or email tech@linclion.org
'use strict';

angular.module('linc.recovery.controller', [])
	// Login
	.controller('RecoveryCtrl', ['$scope', '$state', '$stateParams', '$q', '$uibModal', 'AuthService', 'NotificationFactory',
		function ($scope, $state, $stateParams, $q, $uibModal, AuthService, NotificationFactory) {
			$scope.recoveryData = { password: '', confirm_password: '', _xsrf: '' };
			$scope.dataLoading = false;

			$scope.resetPassword = function () {
				if ($scope.dataLoading) return;
				if ($scope.recoveryData.password != $scope.recoveryData.confirm_password) {
					NotificationFactory.error({
						title: "Fail", message: 'Passwords do not match',
						position: 'right', // right, left, center
						duration: 5000   // milisecond
					});
					return;
				}
				$scope.dataLoading = true;
				AuthService.UpdatePassword({
					code: $stateParams.code,
					password: $scope.recoveryData.password,
				}).then(function (response) {
					NotificationFactory.success({
						title: "Success",
						message: response.message || 'Password updated successfully',
						position: "right", // right, left, center
						duration: 2000     // milisecond
					});
					$scope.dataLoading = false;
				}, function (error) {
					$scope.dataLoading = false;
					var title = "Error";
					if (error.status == 404)
						title = "Not Found";
					var message = error.message;
					NotificationFactory.error({
						title: title, message: message,
						position: 'right', // right, left, center
						duration: 5000   // milisecond
					});
				});

			}

			$scope.goToLogin = function () {
				$state.go('login');
			}
		}]);
