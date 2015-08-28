'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ui.tree'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('grandmas');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('treeMenus');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('grandmas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Grandmas', 'grandmas', 'dropdown', '/grandmas(/create)?');
		Menus.addSubMenuItem('topbar', 'grandmas', 'List Grandmas', 'grandmas');
		Menus.addSubMenuItem('topbar', 'grandmas', 'New Grandma', 'grandmas/create');
	}
]);
'use strict';

//Setting up route
angular.module('grandmas').config(['$stateProvider',
	function($stateProvider) {
		// Grandmas state routing
		$stateProvider.
		state('listGrandmas', {
			url: '/grandmas',
			templateUrl: 'modules/grandmas/views/list-grandmas.client.view.html'
		}).
		state('createGrandma', {
			url: '/grandmas/create',
			templateUrl: 'modules/grandmas/views/create-grandma.client.view.html'
		}).
		state('editGrandma', {
			url: '/grandmas/:grandmaId/edit',
			templateUrl: 'modules/grandmas/views/edit-grandma.client.view.html'
		});
	}
]);

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

		$scope.toggleEdit = function() {
			$scope.editIsOn = !$scope.editIsOn;
		};

	}
]);

'use strict';

//Grandmas service used to communicate Grandmas REST endpoints
angular.module('grandmas').factory('Grandmas', ['$resource',
	function($resource) {
		return $resource('grandmas/:grandmaId', { grandmaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}

		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('treeMenus').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'TreeMenus', 'treeMenus', 'dropdown', '/treeMenus(/create)?');
		Menus.addSubMenuItem('topbar', 'treeMenus', 'List TreeMenus', 'treeMenus');
		Menus.addSubMenuItem('topbar', 'treeMenus', 'New TreeMenu', 'treeMenus/create');
	}
]);
'use strict';

//Setting up route
angular.module('treeMenus').config(['$stateProvider',
	function($stateProvider) {
		// TreeMenus state routing
		$stateProvider.
		state('listTreeMenus', {
			url: '/treeMenus',
			templateUrl: 'modules/treeMenus/views/list-treeMenus.client.view.html'
		}).
		state('createTreeMenu', {
			url: '/treeMenus/create',
			templateUrl: 'modules/treeMenus/views/create-treeMenu.client.view.html'
		}).
		state('viewTreeMenu', {
			url: '/treeMenus/:treeMenuId',
			templateUrl: 'modules/treeMenus/views/view-treeMenu.client.view.html'
		}).
		state('editTreeMenu', {
			url: '/treeMenus/:treeMenuId/edit',
			templateUrl: 'modules/treeMenus/views/edit-treeMenu.client.view.html'
		});
	}
]);
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
				digit: this.digit,
				spokenName: this.spokenName
				// address: this.address,
				// lat: this.lat,
				// lon: this.lon
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

'use strict';

//TreeMenus service used to communicate TreeMenus REST endpoints
angular.module('treeMenus').factory('TreeMenus', ['$resource',
	function($resource) {
		return $resource('treeMenus/:treeMenuId', { treeMenuId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';
// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		var dialog;
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/core/views/home.client.view.html',
			onEnter: ['$stateParams', '$state', '$modal', '$resource', function($stateParams, $state, $modal, $resource) {
				dialog = $modal.open({
						templateUrl: 'modules/users/views/authentication/signup.client.view.html',
						size: 'sm'
				});
				dialog.result.then(
					function() {
						$state.go('home');
					},
					function() {
						$state.go('home');
					},
					function() {}
				);
			}],
			onExit: ['$stateParams', '$state', '$modal', '$resource', function($stateParams, $state, $modal, $resource) {
				dialog.close();
			}]
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/core/views/home.client.view.html',
			onEnter: ['$stateParams', '$state', '$modal', '$resource', function($stateParams, $state, $modal, $resource) {
        dialog = $modal.open({
						templateUrl: 'modules/users/views/authentication/signin.client.view.html',
						size: 'sm'
			  });
				dialog.result.then(
					function() {
						$state.go('home');
					},
					function() {
						$state.go('home');
					},
					function() {}
        );
    	}],
			onExit: ['$stateParams', '$state', '$modal', '$resource', function($stateParams, $state, $modal, $resource) {
				dialog.close();
			}]
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window', function($window) {
	var auth = {
		user: $window.user
	};
	
	return auth;
}]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);