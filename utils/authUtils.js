const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'my_big_secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'

const seedUsers = async () => {
	try {
		const adminCount = await User.countDocuments({ role: 'admin' })
		const userCount = await User.countDocuments({ role: 'user' })

		if (adminCount === 0) {
			const hashedAdminPassword = await bcrypt.hash('admin_password', 10)
			await User.create({
				username: 'admin',
				password: hashedAdminPassword,
				role: 'admin'
			})
			console.log('Admin user created')
		}

		if (userCount === 0) {
			const hashedUserPassword = await bcrypt.hash('user_password', 10)
			await User.create({
				username: 'user',
				password: hashedUserPassword,
				role: 'user'
			})
			console.log('Regular user created')
		}
	} catch (error) {
		console.error('Error seeding users:', error)
	}
}

const login = async (username, password) => {
	const user = await User.findOne({ username })

	if (!user) {
		throw new Error('Invalid credentials')
	}

	const isPasswordValid = await bcrypt.compare(password, user.password)

	if (!isPasswordValid) {
		throw new Error('Invalid credentials')
	}

	const token = jwt.sign(
		{
			id: user._id,
			username: user.username,
			role: user.role
		},
		JWT_SECRET,
		{ expiresIn: JWT_EXPIRES_IN }
	)

	return {
		token,
		user: {
			id: user._id,
			username: user.username,
			role: user.role
		}
	}
}

const authenticateToken = (requiredRoles) => {
	return async (req, res, next) => {
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]

		if (!token) {
			return res.status(401).json({ message: 'No token provided' })
		}

		try {
			const decoded = jwt.verify(token, JWT_SECRET)

			if (requiredRoles && requiredRoles.length > 0) {
				if (!requiredRoles.includes(decoded.role)) {
					return res.status(403).json({ message: 'Insufficient permissions' })
				}
			}

			req.user = decoded
			next()
		} catch (error) {
			return res.status(403).json({ message: 'Invalid or expired token' })
		}
	}
}

module.exports = {
	seedUsers,
	login,
	authenticateToken
}
