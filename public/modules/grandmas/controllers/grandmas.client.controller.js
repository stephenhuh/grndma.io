'use strict';

// Grandmas controller
angular.module('grandmas').controller('GrandmasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Grandmas', '$http',
	function($scope, $stateParams, $location, Authentication, Grandmas, $http) {
		$scope.authentication = Authentication;
		$scope.showGrandmaMetadata = false;
		$scope.list = [
  {
    'id': 1,
    'title': '1. dragon-breath',
    'items': []
  },
  {
    'id': 2,
    'title': '2. moiré-vision',
    'items': [
      {
        'id': 21,
        'title': '2.1. tofu-animation',
        'items': [
          {
            'id': 211,
            'title': '2.1.1. spooky-giraffe',
            'items': []
          },
          {
            'id': 212,
            'title': '2.1.2. bubble-burst',
            'items': []
          }
        ]
      },
      {
        'id': 22,
        'title': '2.2. barehand-atomsplitting',
        'items': []
      }
    ]
  },
  {
    'id': 3,
    'title': '3. unicorn-zapper',
    'items': []
  },
  {
    'id': 4,
    'title': '4. romantic-transclusion',
    'items': []
  }
];

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

			$scope.grandma.rootTreeMenu[0].children.splice(index, 1);
		};

		$scope.addTreeMenu = function(newIndex) {
			// debugger;
			$scope.newTreeMenuIndex = newIndex;
			var test = newIndex;
			var grandma = $scope.grandma;
			console.log(grandma.rootTreeMenu[0]);
			//TODO: call update first
			$http.put('grandmas/' + grandma._id + '/addTreeMenu', {newTreeMenuIndex: newIndex });

			$location.path('grandmas/' + grandma._id + '/edit');
		};
	}
]);
