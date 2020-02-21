const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	user: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	timeStamp: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Chat', messageSchema);
