const express = require('express');
const router = express.Router();
const Income = require('../models/incomeModel');
const { getErrorStatusCode, createErrorResponse } = require('../utils/errorCodes');
const { authenticateToken } = require('../utils/authUtils');

router.post('/post', authenticateToken(['admin']), async (req, res) => {
	const data = new Income({
		cash_in: req.body.cash,
		app: req.body.app,
		cp: req.body.cp,
		date: req.body.date
	});

	try {
		const dataToSave = await data.save();
		res.status(200).json(dataToSave);
	} catch (error) {
		console.log(error)
		const statusCode = getErrorStatusCode(error);
		res.status(statusCode).json(createErrorResponse(error));
	}
});

router.get('/getAll', authenticateToken(['admin', 'user']), async (req, res) => {
	try {
		const data = await Income.find();
		res.status(200).json(data);
	} catch (error) {
		const statusCode = getErrorStatusCode(error);
		res.status(statusCode).json(createErrorResponse(error));
	}
});

router.get('/getOne/:id', authenticateToken(['admin', 'user']), async (req, res) => {
	try {
		const data = await Income.findById(req.params.id);

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

router.patch('/update/:id', authenticateToken(['admin']), async (req, res) => {
	try {
		const id = req.params.id;
		const updatedData = req.body;
		const options = { new: true };

		const result = await Income.findByIdAndUpdate(id, updatedData, options);

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

router.delete('/delete/:id', authenticateToken(['admin']), async (req, res) => {
	try {
		const id = req.params.id;
		const data = await Income.findByIdAndDelete(id);

		if (!data) {
			return res.status(404).json({
				message: 'Запись не найдена',
				errorType: 'NotFoundError'
			});
		}

		res.status(200).send(`Document from ${data.date} has been deleted`);
	} catch (error) {
		const statusCode = getErrorStatusCode(error);
		res.status(statusCode).json(createErrorResponse(error));
	}
});

module.exports = router;

