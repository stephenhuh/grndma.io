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
			
			$scope.toggle = function (scope) {
				scope.toggle();
			};

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
			$scope.grandma.tree.splice(index, 1);
		};
		
		$scope.addTreeMenu = function(scope, isRootTree) {
			//TODO: call update first
			//I tried to design to avoid treating the root as a special case, but I have not succeeded yet... 
			var nodeData;
			if(isRootTree) nodeData = $scope.grandma;
			else nodeData = scope.$modelValue;
			nodeData.tree.push({
				name: 'Item ' + (nodeData.tree.length + 1),
				tree: []
			});
		//	$location.path('grandmas/' + grandma._id + '/edit');
		};
		
		$scope.addService = function(scope) {
			$http.put('grandmas/' + $scope.grandma._id + '/addService').
				success(function(data, status, headers, config) {
					console.log('yay service added ' + JSON.stringify(data));
				//	scope.$modelValue.serviceID ='fasdfasdf';
					scope.$modelValue.serviceID = data._id;
					$scope.grandma.apiServices.push(data);
					console.log(scope.$modelValue.serviceID);
					console.log(scope.$modelValue);
				}).
				error(function(data, status, headers, config) {
					console.error('add service ajax error ' + data);
				});
		};
		
		
		
		
		
		$scope.addTreeMenuServer = function(scope, isRootTree) {
			//I tried to design to avoid treating the root as a special case, but I have not succeeded yet... 
			var nodeData;
			if(isRootTree) nodeData = $scope.grandma;
			else nodeData = scope.$modelValue;
			
			console.log('addtreemenu got ' + nodeData);
			
		//	$scope.newTreeMenuIndex = newIndex;
			var grandma = $scope.grandma;
			//TODO: call update first
			//this fancy business is to get some server-side validation in the picture
			$http.put('grandmas/' + grandma._id + '/addTreeMenu', {newTreeMenuIndex: 0 }).
					success(function(data, status, headers, config) {
						console.log('yay node added ' + JSON.stringify(data));
					nodeData.tree.push(data);
		  		}).
		  		error(function(data, status, headers, config) {
						console.error('add node ajax error ' + data);
		  		});
					//TODO: push to tree[] from scope 
			//$location.path('grandmas/' + grandma._id + '/edit');
		};
	}
]);
