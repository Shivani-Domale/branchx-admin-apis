require('dotenv').config();
const express = require('express');

const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/error.Handler');
const logger = require('./config/logger');
const apiRoutes = require('./routes'); 
const adminRoutes = require('./routes/admin.routes');
const { ServerConfig } = require('./config');
const app = express();

app.use(express.json());

app.use("/api", apiRoutes); 
app.use('/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users', userRoutes);
app.use(errorHandler);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server is running on port ${ServerConfig.PORT}`);
});
