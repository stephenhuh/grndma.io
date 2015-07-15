'use strict';

// Grandmas controller
angular.module('grandmas').controller('GrandmasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Grandmas', '$http',
	function($scope, $stateParams, $location, Authentication, Grandmas, $http) {
		$scope.authentication = Authentication;

		$scope.showGrandmaMetadata = false;

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

		$scope.deleteTreeMenu = function(index) {
			//not sure if this will work past node 1
			//probably not even needed angular magic seems to have taken over
			$scope.grandma.rootTreeMenu[0].children.splice(index, 1);
		};
		
		$scope.addTreeMenuOld = function(newIndex) {
			// debugger;
			$scope.newTreeMenuIndex = newIndex;
			var grandma = $scope.grandma;
		//	console.log(grandma.rootTreeMenu[0]);
			//TODO: call update first
			$http.put('grandmas/' + grandma._id + '/addTreeMenu', {newTreeMenuIndex: newIndex });
			
			$location.path('grandmas/' + grandma._id + '/edit');
		};
		
		$scope.addTreeMenu = function(newIndex) {
			$scope.newTreeMenuIndex = newIndex;
			var grandma = $scope.grandma;
		//	console.log(grandma.rootTreeMenu[0]);
			//TODO: call update first
			//this fancy business is to get some server-side validation in the picture
			$http.put('grandmas/' + grandma._id + '/addTreeMenu', {newTreeMenuIndex: newIndex }).
					success(function(data, status, headers, config) {
						console.log('yay node added ' + JSON.stringify(data));
					grandma.rootTreeMenu[0].children.push(data);
		  		}).
		  		error(function(data, status, headers, config) {
						console.error('add node ajax error ' + data);
		  		});
		
			//$location.path('grandmas/' + grandma._id + '/edit');
		};
	}
]);
