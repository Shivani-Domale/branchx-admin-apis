require('dotenv').config();
const express = require('express');

const apiRoutes = require('./routes'); 
const adminRoutes = require('./routes/admin.routes');
const { ServerConfig } = require('./config');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/error.Handler');
const logger = require('./config/logger');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],// Allow specific headers
    credentials:true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use("/api", apiRoutes); 
app.use('/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users', userRoutes);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
logger.info(`Server is running on port ${process.env.PORT}`);
});
