'use strict';

(function() {
	// Grandmas Controller Spec
	describe('Grandmas Controller Tests', function() {
		// Initialize global variables
		var GrandmasController,
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

			// Initialize the Grandmas controller.
			GrandmasController = $controller('GrandmasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Grandma object fetched from XHR', inject(function(Grandmas) {
			// Create sample Grandma using the Grandmas service
			var sampleGrandma = new Grandmas({
				name: 'New Grandma'
			});

			// Create a sample Grandmas array that includes the new Grandma
			var sampleGrandmas = [sampleGrandma];

			// Set GET response
			$httpBackend.expectGET('grandmas').respond(sampleGrandmas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grandmas).toEqualData(sampleGrandmas);
		}));

		it('$scope.findOne() should create an array with one Grandma object fetched from XHR using a grandmaId URL parameter', inject(function(Grandmas) {
			// Define a sample Grandma object
			var sampleGrandma = new Grandmas({
				name: 'New Grandma'
			});

			// Set the URL parameter
			$stateParams.grandmaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/grandmas\/([0-9a-fA-F]{24})$/).respond(sampleGrandma);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grandma).toEqualData(sampleGrandma);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Grandmas) {
			// Create a sample Grandma object
			var sampleGrandmaPostData = new Grandmas({
				name: 'New Grandma'
			});

			// Create a sample Grandma response
			var sampleGrandmaResponse = new Grandmas({
				_id: '525cf20451979dea2c000001',
				name: 'New Grandma'
			});

			// Fixture mock form input values
			scope.name = 'New Grandma';

			// Set POST response
			$httpBackend.expectPOST('grandmas', sampleGrandmaPostData).respond(sampleGrandmaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Grandma was created
			expect($location.path()).toBe('/grandmas/' + sampleGrandmaResponse._id);
		}));

		it('$scope.update() should update a valid Grandma', inject(function(Grandmas) {
			// Define a sample Grandma put data
			var sampleGrandmaPutData = new Grandmas({
				_id: '525cf20451979dea2c000001',
				name: 'New Grandma'
			});

			// Mock Grandma in scope
			scope.grandma = sampleGrandmaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/grandmas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/grandmas/' + sampleGrandmaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid grandmaId and remove the Grandma from the scope', inject(function(Grandmas) {
			// Create new Grandma object
			var sampleGrandma = new Grandmas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Grandmas array and include the Grandma
			scope.grandmas = [sampleGrandma];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/grandmas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGrandma);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.grandmas.length).toBe(0);
		}));
	});
}());