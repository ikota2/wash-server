
const express = require('express');
const router = express.Router();
const Outcome = require('../models/outcomeModel');
const { getErrorStatusCode, createErrorResponse } = require('../utils/errorCodes');

router.post('/post', async (req, res) => {
	const data = new Outcome({
		date: req.body.date,
		iron_change: req.body.iron_change || '',
		insurance: req.body.insurance || '',
		ss: req.body.ss || '',
		clean_tools: req.body.clean_tools || '',
		clean_salary: req.body.clean_salary || '',
		internet: req.body.internet || '',
		water: req.body.water || '',
		energy: req.body.energy || '',
		tpv: req.body.tpv || '',
		rent: req.body.rent || '',
		rent_deposit: req.body.rent_deposit || '',
		quarter: req.body.quarter || ''
	});

	try {
		const dataToSave = await data.save();
		res.status(200).json(dataToSave);
	} catch (error) {
		console.log(error);
		const statusCode = getErrorStatusCode(error);
		res.status(statusCode).json(createErrorResponse(error));
	}
});

router.get('/getAll', async (req, res) => {
	try {
		const data = await Outcome.find();
		res.status(200).json(data);
	} catch (error) {
		const statusCode = getErrorStatusCode(error);
		res.status(statusCode).json(createErrorResponse(error));
	}
});

router.get('/getOne/:id', async (req, res) => {
	try {
		const data = await Outcome.findById(req.params.id);

		if (!data) {
			return res.status(404).json({
				message: 'Запись не найдена',
				errorType: 'NotFoundError'
			});
		}

		res.status(200).json(data);
	} catch (error) {
		const statusCode = getErrorStatusCode(error);
		res.status(statusCode).json(createErrorResponse(error));
	}
});

router.patch('/update/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const updatedData = req.body;
		const options = { new: true };

		const result = await Outcome.findByIdAndUpdate(id, updatedData, options);

		if (!result) {
			return res.status(404).json({
				message: 'Запись не найдена',
				errorType: 'NotFoundError'
			});
		}

		res.status(200).json(result);
	} catch (error) {
		const statusCode = getErrorStatusCode(error);
		res.status(statusCode).json(createErrorResponse(error));
	}
});

router.delete('/delete/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const data = await Outcome.findByIdAndDelete(id);

		if (!data) {
			return res.status(404).json({
				message: 'Запись не найдена',
				errorType: 'NotFoundError'
			});
		}

		res.status(200).send(`Документ с датой ${data.date} был удален..`);
	} catch (error) {
		const statusCode = getErrorStatusCode(error);
		res.status(statusCode).json(createErrorResponse(error));
	}
});

module.exports = router;
