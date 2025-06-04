require('dotenv').config();
const express = require('express');

const apiRoutes = require('./routes'); 
const adminRoutes = require('./routes/admin-routes');
const { ServerConfig } = require('./config');
const userRoutes = require('./routes/v1/user.routes');
const errorHandler = require('./middlewares/error.Handler');
const logger = require('./config/logger');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],// Allow specific headers
    credentials:true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use('/admin', adminRoutes);
app.use('/api',apiRoutes)
app.use(errorHandler);

app.listen(process.env.PORT, () => {
console.log(`Server is running on port ${process.env.PORT}`);
});
