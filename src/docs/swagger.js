const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Xpandifi Admin API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    servers: [
      {
        url: 'https://branchx-admin-apis.onrender.com/api/v1', 
      },
    ],
  },
  apis: ['./src/routes/v1/*.js'], // Path to your routes with Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
