require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const incomeRoutes = require('./routes/incomeRoutes');
const outcomeRoutes = require('./routes/outcomeRoutes');
const { seedUsers, login } = require('./utils/authUtils');

const app = express();
const mongoString = process.env.DATABASE_URL;

app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const result = await login(username, password)
        res.json(result)
    } catch (error) {
        res.status(401).json({ message: (error).message })
    }
})

app.use('/api/income', incomeRoutes);
app.use('/api/outcome', outcomeRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(mongoString);
        console.log('Database Connected');
        return true;
    } catch (error) {
        console.error('Database connection error:', error.message);
        return false;
    }
};

const startServer = async () => {
    const port = process.env.PORT || 3001;

    if (require.main === module) {
        const connected = await connectDB();

        if (connected) {
            await seedUsers();
            const server = app.listen(port, () => {
                console.log(`Server Started at ${port}`);
            });

            server.on('error', (error) => {
                if (error.code === 'EADDRINUSE') {
                    console.error(`Port ${port} is already in use`);
                    process.exit(1);
                } else {
                    console.error('Server error:', error.message);
                }
            });
        }
    }
};

startServer();

module.exports = { app, connectDB };
