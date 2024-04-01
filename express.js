const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User=require('./models/user');
const fs=require('fs');
const Movie = require('./models/movie.js');
const Actor=require('./models/actor.js')
const { requireRole } = require('./middleware/verifyrole.js');
const { verifyToken }= require('./middleware/verifytoken.js')
const PORT = process.env.PORT || 8000;
const JWT_SECRET = "aishwarya@reddy"; 
const expiresIn='1h';
const multer=require('multer');


const { graphqlHTTP } = require("express-graphql");
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = require("./schemas/schema.js");
const resolvers = require("./schemas/resolver.js");
const users=require('./services/users.js');
const movies=require('./services/movies.js');

const startServer = async () => {
  try {

    await mongoose.connect('mongodb+srv://avinashdeshpande:avinash1234@cluster0.pghegxv.mongodb.net/movieapi?retryWrites=true&w=majority&appName=Cluster0');
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
