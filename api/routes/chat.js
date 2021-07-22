const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const Message = require('../models/message');
var format = require('date-fns/format');

/* CHAT */
router.get('/', (req, res, next) => {
	Message.find()
		.select('user message timeStamp _id')
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				messages: docs.map(doc => {
					return {
						user: doc.user,
						message: doc.message,
						timeStamp: doc.timeStamp,
						_id: doc._id,
						request: {
							type: 'GET',
							url: path.join(__dirname + '/chat/' + doc._id)
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

/* GET USER */
router.get('/:messageID', (req, res, next) => {
	console.log('GETT');
	const ID = req.params.messageID;
	Message.findById(ID)
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

router.post('/', (req, res, next) => {
	console.log(req.body);

	// Save new message
	const message = new Message({
		_id: new mongoose.Types.ObjectId(),
		user: req.body.user,
		message: req.body.message,
		timeStamp: format(new Date(), 'MM/dd HH:mm:ss')
	});

	// And save with mongoose
	message
		.save()
		.then(result => {
			res.status(201).json({
				message: 'Message saved',
				createdUser: {
					user: result.user,
					message: result.message,
					timeStamp: result.timeStamp,
					_id: result._id,
					request: {
						type: 'GET',
						url: 'http://' + req.get('host') + '/chat/' + message._id
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

// TEST
router.delete('/:messageID', (req, res, next) => {
	const id = req.params.messageID;
	Message.remove({ _id: id })
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
