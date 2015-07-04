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