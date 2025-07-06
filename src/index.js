require('dotenv').config();
const express = require('express');

const apiRoutes = require('./routes');
const adminRoutes = require('./routes/v1/admin-routes');
const { ServerConfig } = require('./config');
const userRoutes = require('./routes/v1/user-routes');
const errorHandler = require('./middlewares/error-Handler');
const logger = require('./config/logger');
const deviceRoutes = require('./routes/v1/device-routes');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    'http://139.59.23.86:9090',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:3000'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.use('/admin', adminRoutes);
app.use('/api', apiRoutes)
app.use('/api', deviceRoutes);
app.use(errorHandler);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
