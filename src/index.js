const express = require('express');
const { ServiceConfig } = require('./config');


const app = express();

app.listen(ServiceConfig.PORT, () => {
    console.log(`BranchX Admin APIs listening on port ${ServiceConfig.PORT}`);
});