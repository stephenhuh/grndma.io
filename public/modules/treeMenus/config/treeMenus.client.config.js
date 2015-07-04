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