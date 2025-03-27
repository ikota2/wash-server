const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
	cash_in: {
		required: true,
		type: String,
	},
	cash_out: {
		required: true,
		type: String,
	},
	app: {
		required: true,
		type: String,
	},
	cp: {
		required: true,
		type: String,
	},
	date: {
		required: true,
		type: String,
	}
})

module.exports = mongoose.model('Income', incomeSchema);
