const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
	name: {
		required: true,
		type: String
	},
	age: {
		required: true,
		type: Number
	}
})

module.exports = mongoose.model('Data', dataSchema);

const incomeSchema = new mongoose.Schema({
	cash_in: {
		required: false,
		type: String,
	},
	cash_out: {
		required: false,
		type: String,
	},
	app: {
		required: false,
		type: String,
	},
	cp: {
		required: false,
		type: String,
	},
	date: {
		required: true,
		type: String,
	}
})

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
