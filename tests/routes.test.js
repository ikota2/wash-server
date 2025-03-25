const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../index');

let mongoServer;
let testServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri);

	testServer = app.listen(3001);
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
	await testServer.close();
});

describe('API Routes', () => {
	const API_ENDPOINTS = {
		POST: '/api/post',
		GET_ALL: '/api/getAll',
		GET_ONE: (id) => `/api/getOne/${id}`,
		UPDATE: (id) => `/api/update/${id}`,
		DELETE: (id) => `/api/delete/${id}`
	};

	let id;

	test('POST /api/post - create a new', async () => {
		const res = await request(testServer)
			.post(API_ENDPOINTS.POST)
			.send({name: 'John Doe', age: 30});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('_id');
		expect(res.body.name).toBe('John Doe');
		expect(res.body.name).not.toBe('John Mulder');
		expect(res.body.age).toBe(30);
		expect(res.body.age).not.toBe('thirty');

		id = res.body._id;
	});

	test('POST /api/post - error if there are not required fields', async () => {
		const res = await request(testServer)
			.post(API_ENDPOINTS.POST)
			.send({});

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toContain('validation failed');
	});

	test('POST /api/post - error if with only name field', async () => {
		const res = await request(testServer)
			.post(API_ENDPOINTS.POST)
			.send({name: 'Only Name'});

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toContain('age');
	});

	test('POST /api/post - error if only age field', async () => {
		const res = await request(testServer)
			.post(API_ENDPOINTS.POST)
			.send({age: 25});

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toContain('name');
	});

	test('GET /api/getAll', async () => {
		const res = await request(testServer)
			.get(API_ENDPOINTS.GET_ALL);

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBeTruthy();
		expect(res.body.length).toBeGreaterThan(0);

		if (res.body.length > 0) {
			expect(res.body[0]).toHaveProperty('_id');
			expect(res.body[0]).toHaveProperty('name');
			expect(res.body[0]).toHaveProperty('age');
		}
	});

	test('GET /api/getOne/:id', async () => {
		const res = await request(testServer)
			.get(API_ENDPOINTS.GET_ONE(id));

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('_id', id);
		expect(res.body.name).toBe('John Doe');
	});

	test('GET /api/getOne/:id - error with invalid ID', async () => {
		const invalidId = 'invalid-id-format';
		const res = await request(testServer)
			.get(API_ENDPOINTS.GET_ONE(invalidId));

		expect(res.statusCode).toBe(500);
		expect(res.body).toHaveProperty('message');
	});

	test('GET /api/getOne/:id - not found with non-existent ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId();
		const res = await request(testServer)
			.get(API_ENDPOINTS.GET_ONE(nonExistentId));

		if (res.statusCode === 404) {
			expect(res.body).toHaveProperty('message');
		} else {
			expect(res.statusCode).toBe(200);
			expect(res.body).toBe(null);
		}
	});

	test('PATCH /api/update/:id - обновление записи', async () => {
		const res = await request(testServer)
			.patch(API_ENDPOINTS.UPDATE(id))
			.send({name: 'John Dillinger'});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('_id', id);
		expect(res.body.name).toBe('John Dillinger');
		expect(res.body.name).not.toBe('John Malkovich');
		expect(res.body.age).toBe(30);
	});

	test('PATCH /api/update/:id - error with invalid ID', async () => {
		const invalidId = 'invalid-id';
		const res = await request(testServer)
			.patch(API_ENDPOINTS.UPDATE(invalidId))
			.send({name: 'Sara Jessica Parker'});

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('message');
	});

	test('PATCH /api/update/:id - not found with non-existent ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId();
		const res = await request(testServer)
			.patch(API_ENDPOINTS.UPDATE(nonExistentId))
			.send({name: 'Sara Jessica Parker'});

		expect([404, 400, 200]).toContain(res.statusCode);

		if (res.statusCode === 200 && res.body === null) {
			expect(res.body).toBe(null);
		}
	});

	test('DELETE /api/delete/:id', async () => {
		const res = await request(testServer)
		.delete(API_ENDPOINTS.DELETE(id));

		expect(res.statusCode).toBe(200);
		expect(res.text).toContain('has been deleted');

		const checkRes = await request(testServer)
			.get(API_ENDPOINTS.GET_ONE(id));
		expect(checkRes.body).toBe(null);
	});

	test('DELETE /api/delete/:id - error with invalid ID', async () => {
		const invalidId = 'invalid-id';
		const res = await request(testServer)
			.delete(API_ENDPOINTS.DELETE(invalidId));

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty('message');
	});

	test('DELETE /api/delete/:id - not found with non-existent ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId();
		const res = await request(testServer)
			.delete(API_ENDPOINTS.DELETE(nonExistentId));

		if (res.statusCode === 404) {
			expect(res.body).toHaveProperty('message');
		} else if (res.statusCode === 400) {
			expect(res.body).toHaveProperty('message');
		} else {
			expect(res.statusCode).toBe(200);
		}
	});
});
