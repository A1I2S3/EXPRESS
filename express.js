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
const apiSpec = path.join(__dirname,'openapi.json');
const openapispec= JSON.parse(fs.readFileSync(apiSpec,'utf8'));
const swaggerUi = require('swagger-ui-express');
const movieRoutes=require('./routes/movieRoutes.js');
const actorRoutes=require('./routes/actorRoutes.js');
const userRoutes=require('./routes/userRoutes.js');
const startServer = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Mongodb');
    const app = express();

    app.use(bodyParser.json());
    app.use('/api/users',userRoutes);
    app.use('/api/movies',movieRoutes);
    app.use('/api/actors',actorRoutes);
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
