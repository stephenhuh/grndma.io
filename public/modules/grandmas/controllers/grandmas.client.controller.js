'use strict';

// Grandmas controller
angular.module('grandmas').controller('GrandmasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Grandmas',
	function($scope, $stateParams, $location, Authentication, Grandmas) {
		$scope.authentication = Authentication;

		// Create new Grandma
		$scope.create = function() {
			// Create new Grandma object
			var grandma = new Grandmas ({
				name: this.name,
				phone: this.phone,
				address: {
					street: this.address.street,
					city: this.address.city,
					state: this.address.state,
					zip: this.address.zip,
					lat: this.address.lat,
					lon: this.address.lon
				}
			});

			// Redirect after save
			grandma.$save(function(response) {
				$location.path('grandmas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Grandma
		$scope.remove = function(grandma) {
			if ( grandma ) {
				grandma.$remove();

				for (var i in $scope.grandmas) {
					if ($scope.grandmas [i] === grandma) {
						$scope.grandmas.splice(i, 1);
					}
				}
			} else {
				$scope.grandma.$remove(function() {
					$location.path('grandmas');
				});
			}
		};

		// Update existing Grandma
		$scope.update = function() {
			var grandma = $scope.grandma;

			grandma.$update(function() {
				$location.path('grandmas/' + grandma._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Grandmas
		$scope.find = function() {
			$scope.grandmas = Grandmas.query();
		};

		// Find existing Grandma
		$scope.findOne = function() {
			$scope.grandma = Grandmas.get({
				grandmaId: $stateParams.grandmaId
			});
		};

		$scope.addTreeMenu = function( menuName, menuDigit ) {
			console.log($scope.grandma.rootTreeMenu[0]);
			$scope.grandma.rootTreeMenu[0].children.push({name:menuName, digit:menuDigit});
		};
	}
]);
