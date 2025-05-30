require('dotenv').config();
const express = require('express');
const app = express();

const apiRoutes = require('./routes'); 
const adminRoutes = require('./routes/admin.routes');
const { ServerConfig } = require('./config');

app.use(express.json());

app.use("/api", apiRoutes); 
app.use('/admin', adminRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server is running on port ${ServerConfig.PORT}`);
});
