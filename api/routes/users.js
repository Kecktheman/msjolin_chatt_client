const express = require('express');
const router = express.Router();
const path = require('path');

const mongoose = require('mongoose');

const User = require('../models/users');

/* USERS */
router.get('/', (req, res, next) => {
	User.find()
		.select('name age _id')
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				users: docs.map(doc => {
					return {
						name: doc.name,
						age: doc.age,
						_id: doc._id,
						request: {
							type: 'GET',
							url: path.join(__dirname + '/users/' + doc._id)
						}
					};
				})
			};

			res.status(200).json({
				response
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

router.post('/', (req, res, next) => {
	// Create new user
	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		age: req.body.age
	});

	// And save with mongoose
	user
		.save()
		.then(result => {
			res.status(201).json({
				message: 'Created user successfully',
				createdUser: {
					name: result.name,
					age: result.age,
					_id: result._id,
					request: {
						type: 'GET',
						url: 'http://' + req.get('host') + '/users/' + result._id
					}
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

/* GET USER */
router.get('/:userID', (req, res, next) => {
	const ID = req.params.userID;
	User.findById(ID)
		.select('-__v')
		.exec()
		.then(doc => {
			if (doc) {
				res.status(200).json(doc);
			} else
				[
					res.status(404).json({
						message: 'No user found with id: ' + ID
					})
				];

			res.status(200).json({
				doc
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

/* router.post("/:userID", (req, res, next) => {
	const ID = req.params.userID;
	res.status(200).json({
		message: "User was created ",
		id: ID
	});
}); */

// UPDATE
router.patch('/:userID', (req, res, next) => {
	const id = req.params.userID;

	// Change existing propertys dynamicly
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}

	User.update({ _id: id }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result);
			res.status(200).json({
				message: 'User has been updated successfully',
				user: {
					request: {
						type: 'GET',
						url: 'http://' + req.get('host') + '/users/' + id
					}
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

// DELETE
router.delete('/:userID', (req, res, next) => {
	const id = req.params.userID;
	User.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;
