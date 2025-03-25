require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const routes = require('./routes/routes');
const incomeRoutes = require('./routes/incomeRoutes');
const outcomeRoutes = require('./routes/outcomeRoutes');
const app = express();

app.use(express.json());
// TODO
app.use('/api', routes);
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
