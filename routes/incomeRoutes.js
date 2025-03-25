// it works, but error numbers are wrong

// const express = require('express');
// const router = express.Router();
// const Income = require('../models/incomeModel');
//
// router.post('/post', async (req, res) => {
// 	const data = new Income({
// 		cash_in: req.body.cash_in,
// 		cash_out: req.body.cash_out,
// 		app: req.body.app,
// 		cp: req.body.cp,
// 		date: req.body.date
// 	})
//
// 	try {
// 		const dataToSave = await data.save();
// 		res.status(200).json(dataToSave);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// });
//
// router.get('/getAll', async (req, res) => {
// 	try {
// 		const data = await Income.find();
// 		res.json(data);
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// });
//
// router.get('/getOne/:id', async (req, res) => {
// 	try {
// 		const data = await Income.findById(req.params.id);
// 		res.json(data);
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// });
//
// router.patch('/update/:id', async (req, res) => {
// 	try {
// 		const id = req.params.id;
// 		const updatedData = req.body;
// 		const options = { new: true };
//
// 		const result = await Income.findByIdAndUpdate(
// 			id, updatedData, options
// 		);
//
// 		res.send(result);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// });
//
// // TODO LOL
// router.delete('/delete/:id', async (req, res) => {
// 	try {
// 		const id = req.params.id;
// 		const data = await Income.findByIdAndDelete(id);
// 		res.send(`Document from ${data.date} was removed`);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// });
//
// module.exports = router;



// it has to work, but I haven't checked it

const express = require('express');
const router = express.Router();
const Income = require('../models/incomeModel');
const { getErrorStatusCode, createErrorResponse } = require('../utils/errorCodes');

router.post('/post', async (req, res) => {
	const data = new Income({
		cash_in: req.body.cash_in,
		cash_out: req.body.cash_out,
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

router.get('/getAll', async (req, res) => {
	try {
		const data = await Income.find();
		res.status(200).json(data);
	} catch (error) {
		const statusCode = getErrorStatusCode(error);
		res.status(statusCode).json(createErrorResponse(error));
	}
});

router.get('/getOne/:id', async (req, res) => {
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

router.patch('/update/:id', async (req, res) => {
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

router.delete('/delete/:id', async (req, res) => {
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

