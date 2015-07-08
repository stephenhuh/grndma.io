'use strict';

(function() {
	// TreeMenus Controller Spec
	describe('TreeMenus Controller Tests', function() {
		// Initialize global variables
		var TreeMenusController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the TreeMenus controller.
			TreeMenusController = $controller('TreeMenusController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one TreeMenu object fetched from XHR', inject(function(TreeMenus) {
			// Create sample TreeMenu using the TreeMenus service
			var sampleTreeMenu = new TreeMenus({
				name: 'New TreeMenu'
			});

			// Create a sample TreeMenus array that includes the new TreeMenu
			var sampleTreeMenus = [sampleTreeMenu];

			// Set GET response
			$httpBackend.expectGET('treeMenus').respond(sampleTreeMenus);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.treeMenus).toEqualData(sampleTreeMenus);
		}));

		it('$scope.findOne() should create an array with one TreeMenu object fetched from XHR using a treeMenuId URL parameter', inject(function(TreeMenus) {
			// Define a sample TreeMenu object
			var sampleTreeMenu = new TreeMenus({
				name: 'New TreeMenu'
			});

			// Set the URL parameter
			$stateParams.treeMenuId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/treeMenus\/([0-9a-fA-F]{24})$/).respond(sampleTreeMenu);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.treeMenu).toEqualData(sampleTreeMenu);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(TreeMenus) {
			// Create a sample TreeMenu object
			var sampleTreeMenuPostData = new TreeMenus({
				name: 'New TreeMenu'
			});

			// Create a sample TreeMenu response
			var sampleTreeMenuResponse = new TreeMenus({
				_id: '525cf20451979dea2c000001',
				name: 'New TreeMenu'
			});

			// Fixture mock form input values
			scope.name = 'New TreeMenu';

			// Set POST response
			$httpBackend.expectPOST('treeMenus', sampleTreeMenuPostData).respond(sampleTreeMenuResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the TreeMenu was created
			expect($location.path()).toBe('/treeMenus/' + sampleTreeMenuResponse._id);
		}));

		it('$scope.update() should update a valid TreeMenu', inject(function(TreeMenus) {
			// Define a sample TreeMenu put data
			var sampleTreeMenuPutData = new TreeMenus({
				_id: '525cf20451979dea2c000001',
				name: 'New TreeMenu'
			});

			// Mock TreeMenu in scope
			scope.treeMenu = sampleTreeMenuPutData;

			// Set PUT response
			$httpBackend.expectPUT(/treeMenus\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/treeMenus/' + sampleTreeMenuPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid treeMenuId and remove the TreeMenu from the scope', inject(function(TreeMenus) {
			// Create new TreeMenu object
			var sampleTreeMenu = new TreeMenus({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new TreeMenus array and include the TreeMenu
			scope.treeMenus = [sampleTreeMenu];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/treeMenus\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTreeMenu);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.treeMenus.length).toBe(0);
		}));
	});
}());