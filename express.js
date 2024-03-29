const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User=require('./models/user');
const fs=require('fs');
const Movie = require('./models/movie.js');
const { requireRole } = require('./middleware/auth');
const PORT = process.env.PORT || 8080;
const JWT_SECRET = "aishwarya@reddy"; 
const multer=require('multer');


const { graphqlHTTP } = require("express-graphql");
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = require("./schemas/schema.js");
const resolvers = require("./schemas/resolver.js");


const startServer = async () => {
  try {

    await mongoose.connect('mongodb+srv://avinashdeshpande:avinash1234@cluster0.pghegxv.mongodb.net/movieapi?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to Mongodb');
    const app = express();

    app.use(bodyParser.json());

    // Middleware to verify JWT token
    const verifyToken = (req, res, next) => {

      const token =req.headers.authorization.split(" ")[1] ||  req.headers.authorization ;
    
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token is missing' });
      }
      
      jwt.verify(token, JWT_SECRET, (err,decoded) => {
        if (err) {
          // console.log("error here")
          console.log(err);
          return res.status(401).json({ error: 'Unauthorized: Invalid token is entered' });
        }
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next()
        
      });
    };

// Create user endpoint
  app.post('/api/users/create', async (req, res) => {
      try {
        console.log("hello")
        const { username, password, role } = req.body;
    
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }
    
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); // Using 10 salt rounds
    
        // Create user
        const user = new User({
          username,
          password:hashedPassword,
          role
        });
        await user.save();
    
        res.json({ message: 'User created successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  
  // Login endpoint
  app.post('/api/users/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
      res.send( token );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Delete user endpoint
  app.delete('/api/users/:userId/delete', verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;
      await User.findByIdAndDelete(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Update user endpoint
  app.put('/api/users/:userId/update', verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;
      
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Using 10 salt rounds
      await User.findByIdAndUpdate(userId, { username, password: hashedPassword, role });
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const upload = multer({ dest: 'uploads/' });

    app.get('/api/movies',verifyToken,async (req,res)=>{
      const allmovies=await Movie.find({},{_id:0,__v:0,createdAt:0,updatedAt:0});
      res.json(allmovies);
    });

    app.post("/api/movies/upload", [verifyToken,requireRole("director"),upload.single('file')], async (req, res) => {
      try {
        const jsonFile = req.file;
        if (!jsonFile || jsonFile.mimetype !== 'application/json') {
          return res.status(400).json({ message: 'Please upload a JSON file' });
        }
        const data = await fs.promises.readFile(jsonFile.path, 'utf8');
        const moviesData = JSON.parse(data);
        const newmovies = moviesData.movies;
        //console.log(newmovies);
        await Movie.insertMany(newmovies);
        res.status(200).json({ message: 'Movies added successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        
        
        
        return req
      }
    });



  
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
