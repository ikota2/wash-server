const mongoose = require('mongoose');

const outcomeSchema = new mongoose.Schema({
	date: {
		required: true,
		type: String,
	},
	iron_change: {
		required: false,
		type: String,
	},
	insurance: {
		required: false,
		type: String,
	},
	ss: {
		required: false,
		type: String,
	},
	clean_tools: {
		required: false,
		type: String,
	},
	clean_salary: {
		required: false,
		type: String,
	},
	internet: {
		required: false,
		type: String,
	},
	water: {
		required: false,
		type: String,
	},
	energy: {
		required: false,
		type: String,
	},
	tpv: {
		required: false,
		type: String,
	},
	rent: {
		required: false,
		type: String,
	},
	rent_deposit: {
		required: false,
		type: String,
	},
	quarter: {
		required: false,
		type: String
	}
})

module.exports = mongoose.model('Outcome', outcomeSchema);
