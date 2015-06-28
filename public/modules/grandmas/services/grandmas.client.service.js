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