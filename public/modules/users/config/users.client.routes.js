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
