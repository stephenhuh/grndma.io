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