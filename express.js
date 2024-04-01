const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080;
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require("./schemas/schema.js");
const resolvers = require("./schemas/resolver.js");
const users=require('./services/users.js');
const movies=require('./services/movies.js');

const startServer = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Mongodb');
    const app = express();

    app.use(bodyParser.json());
    app.use(users);
    app.use(movies);

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
