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
		state('viewGrandma', {
			url: '/grandmas/:grandmaId',
			templateUrl: 'modules/grandmas/views/view-grandma.client.view.html'
		}).
		state('editGrandma', {
			url: '/grandmas/:grandmaId/edit',
			templateUrl: 'modules/grandmas/views/edit-grandma.client.view.html'
		});
	}
]);