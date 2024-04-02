const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs=require('fs');
const PORT = process.env.PORT || 8080;
const path=require('path');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require("./schemas/schema.js");
const resolvers = require("./schemas/resolver.js");
const users=require('./services/users.js');
const movies=require('./services/movies.js');
const OpenApiValidator = require('express-openapi-validator');
const apiSpec = path.join(__dirname,'openapi.json');
const openapispec= JSON.parse(fs.readFileSync(apiSpec,'utf8'));
const swaggerUi = require('swagger-ui-express');

const startServer = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Mongodb');
    const app = express();

    

    app.use(bodyParser.json());
    app.use(users);
    app.use(movies);

    // app.use(OpenApiValidator.middleware({
    //   apiSpec: apiSpec,
    //   validateRequests: true,
    //   validateResponses: true,
    //   validateSecurity: true,
    //   operationHandlers: {
    //     getUser: (req, res, next) => {
    //       const { userId } = req.params;
    //       const user = users.find(user => user.id === userId);
    //       if (user) {
    //         res.json(user);
    //       } else {
    //         res.status(404).json({ message: 'User not found' });
    //       }
    //       next();
    //     },
    //   },
    // }));

    app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(openapispec));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return req}})
  
  await server.start()
   
  server.applyMiddleware({ app });

 app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
    
  } catch (err) {
    console.log('Error connecting to mongodb', err);
    process.exit(1);
  }
};

startServer();
