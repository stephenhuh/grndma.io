'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Grandma = mongoose.model('Grandma'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, grandma;

/**
 * Grandma routes tests
 */
describe('Grandma CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Grandma
		user.save(function() {
			grandma = {
				name: 'Grandma Name'
			};

			done();
		});
	});

	it('should be able to save Grandma instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grandma
				agent.post('/grandmas')
					.send(grandma)
					.expect(200)
					.end(function(grandmaSaveErr, grandmaSaveRes) {
						// Handle Grandma save error
						if (grandmaSaveErr) done(grandmaSaveErr);

						// Get a list of Grandmas
						agent.get('/grandmas')
							.end(function(grandmasGetErr, grandmasGetRes) {
								// Handle Grandma save error
								if (grandmasGetErr) done(grandmasGetErr);

								// Get Grandmas list
								var grandmas = grandmasGetRes.body;

								// Set assertions
								(grandmas[0].user._id).should.equal(userId);
								(grandmas[0].name).should.match('Grandma Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Grandma instance if not logged in', function(done) {
		agent.post('/grandmas')
			.send(grandma)
			.expect(401)
			.end(function(grandmaSaveErr, grandmaSaveRes) {
				// Call the assertion callback
				done(grandmaSaveErr);
			});
	});

	it('should not be able to save Grandma instance if no name is provided', function(done) {
		// Invalidate name field
		grandma.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grandma
				agent.post('/grandmas')
					.send(grandma)
					.expect(400)
					.end(function(grandmaSaveErr, grandmaSaveRes) {
						// Set message assertion
						(grandmaSaveRes.body.message).should.match('Please fill Grandma name');
						
						// Handle Grandma save error
						done(grandmaSaveErr);
					});
			});
	});

	it('should be able to update Grandma instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grandma
				agent.post('/grandmas')
					.send(grandma)
					.expect(200)
					.end(function(grandmaSaveErr, grandmaSaveRes) {
						// Handle Grandma save error
						if (grandmaSaveErr) done(grandmaSaveErr);

						// Update Grandma name
						grandma.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Grandma
						agent.put('/grandmas/' + grandmaSaveRes.body._id)
							.send(grandma)
							.expect(200)
							.end(function(grandmaUpdateErr, grandmaUpdateRes) {
								// Handle Grandma update error
								if (grandmaUpdateErr) done(grandmaUpdateErr);

								// Set assertions
								(grandmaUpdateRes.body._id).should.equal(grandmaSaveRes.body._id);
								(grandmaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Grandmas if not signed in', function(done) {
		// Create new Grandma model instance
		var grandmaObj = new Grandma(grandma);

		// Save the Grandma
		grandmaObj.save(function() {
			// Request Grandmas
			request(app).get('/grandmas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Grandma if not signed in', function(done) {
		// Create new Grandma model instance
		var grandmaObj = new Grandma(grandma);

		// Save the Grandma
		grandmaObj.save(function() {
			request(app).get('/grandmas/' + grandmaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', grandma.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Grandma instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grandma
				agent.post('/grandmas')
					.send(grandma)
					.expect(200)
					.end(function(grandmaSaveErr, grandmaSaveRes) {
						// Handle Grandma save error
						if (grandmaSaveErr) done(grandmaSaveErr);

						// Delete existing Grandma
						agent.delete('/grandmas/' + grandmaSaveRes.body._id)
							.send(grandma)
							.expect(200)
							.end(function(grandmaDeleteErr, grandmaDeleteRes) {
								// Handle Grandma error error
								if (grandmaDeleteErr) done(grandmaDeleteErr);

								// Set assertions
								(grandmaDeleteRes.body._id).should.equal(grandmaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Grandma instance if not signed in', function(done) {
		// Set Grandma user 
		grandma.user = user;

		// Create new Grandma model instance
		var grandmaObj = new Grandma(grandma);

		// Save the Grandma
		grandmaObj.save(function() {
			// Try deleting Grandma
			request(app).delete('/grandmas/' + grandmaObj._id)
			.expect(401)
			.end(function(grandmaDeleteErr, grandmaDeleteRes) {
				// Set message assertion
				(grandmaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Grandma error error
				done(grandmaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Grandma.remove().exec();
		done();
	});
});