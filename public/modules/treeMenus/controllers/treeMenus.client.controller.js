'use strict';

// TreeMenus controller
angular.module('treeMenus').controller('TreeMenusController', ['$scope', '$stateParams', '$location', 'Authentication', 'TreeMenus',
	function($scope, $stateParams, $location, Authentication, TreeMenus) {
		$scope.authentication = Authentication;

		// Create new TreeMenu
		$scope.create = function() {
			// Create new TreeMenu object
			var treeMenu = new TreeMenus ({
				name: this.name,
				phone: this.phone,
				address: this.address,
				lat: this.lat,
				lon: this.lon
			});

			// Redirect after save
			treeMenu.$save(function(response) {
				$location.path('treeMenus/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing TreeMenu
		$scope.remove = function(treeMenu) {
			if ( treeMenu ) { 
				treeMenu.$remove();

				for (var i in $scope.treeMenus) {
					if ($scope.treeMenus [i] === treeMenu) {
						$scope.treeMenus.splice(i, 1);
					}
				}
			} else {
				$scope.treeMenu.$remove(function() {
					$location.path('treeMenus');
				});
			}
		};

		// Update existing TreeMenu
		$scope.update = function() {
			var treeMenu = $scope.treeMenu;

			treeMenu.$update(function() {
				$location.path('treeMenus/' + treeMenu._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of TreeMenus
		$scope.find = function() {
			$scope.treeMenus = TreeMenus.query();
		};

		// Find existing TreeMenu
		$scope.findOne = function() {
			$scope.treeMenu = TreeMenus.get({ 
				treeMenuId: $stateParams.treeMenuId
			});
		};
	}
]);
