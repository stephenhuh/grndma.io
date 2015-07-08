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