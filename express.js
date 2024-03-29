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
const PORT = process.env.PORT || 8080;
const JWT_SECRET = "aishwarya@reddy"; 
const expiresIn='1h';
const multer=require('multer');


const startServer = async () => {
  try {

    await mongoose.connect('mongodb+srv://avinashdeshpande:avinash1234@cluster0.pghegxv.mongodb.net/movieapi?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to Mongodb');
    const app = express();

    app.use(bodyParser.json());
// Create user endpoint
  app.post('/api/users/create', async (req, res) => {
      try {
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
        console.log("user is created as an",role);
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
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET,{expiresIn});
      res.json({ token });
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

  const upload = multer({ storage: multer.memoryStorage() });

    app.get('/api/movies',verifyToken,async (req,res)=>{
      const allmovies=await Movie.find({},{_id:0,__v:0,createdAt:0,updatedAt:0});
      res.json(allmovies);
    });

    //app.use(bodyParser.raw({ type: 'multipart/form-data', limit: '50mb' }));

    app.post("/api/movies/upload", [verifyToken,requireRole("director"),upload.single('file')], async (req, res) => {
      try {
        //console.log(req.headers['content-type']);
    
        const jsonFile = req.file;
        //console.log(jsonFile.buffer);
        if (!jsonFile) {
          return res.status(400).json({ message: 'Please upload a JSON file' });
        }
    
        // if (jsonFile.mimetype !== 'application/json') {
        //   return res.status(400).json({ message: 'Please upload a valid JSON file' });
        // }
    
        const data = jsonFile.buffer.toString('utf8');
        //console.log(data);
        const moviesData = JSON.parse(data);
        const newmovies = moviesData.movies;
    
        const existingTitles = await Movie.distinct("title");
    
        const moviesToAdd = newmovies.filter(movie => !existingTitles.includes(movie.title));
    
        if (moviesToAdd.length === 0) {
          return res.status(409).json({message: 'All movies already exist in the database.'});
        }
    

        await Movie.insertMany(moviesToAdd);
        res.status(200).json({ message: 'Movies added successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    app.post("/api/actors/upload", [verifyToken,requireRole('director'),upload.single('file')], async (req, res) => {
      try {
        const jsonFile = req.file;
        if (!jsonFile) {
          return res.status(400).json({ message: 'Please upload a JSON file' });
        }
        const data=jsonFile.buffer.toString('utf8')
        const actorsData = JSON.parse(data);
        const newactors = actorsData.actors;
        //console.log(newmovies);
        const existingName = await Actor.distinct("name");

        // Filter out new movies whose titles already exist in the database
        const actorsToAdd = newactors.filter(actor => !existingName.includes(actor.name));

        if (actorsToAdd.length === 0) {
          return res.status(409).json({message: 'All actors already exist in the database.'});
        }
        await Actor.insertMany(actorsToAdd);
        res.status(200).json({ message: 'Actors added successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    });



  app.get("/api/movies/download",[verifyToken,requireRole('director')],async (req,res)=>{
       try{
          const movies=await Movie.find();
          if(!movies || movies.length==0){
            res.status(404).send("no movies found");
            return;
          }

          const data={
            movies:movies.map(m=>m.toJSON()),
          }

          const filename='movies.json';
          fs.writeFileSync(filename, JSON.stringify(data, null, 2));
          console.log(`Movies and actors data saved to ${filename}`);
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
          const file = fs.createReadStream(filename);
          file.pipe(res);
       }catch(err){
        console.error("error in fetching and downloading movies")
       }
  })



  app.get("/api/actors/download",[verifyToken,requireRole(['director','actor'])],async (req,res)=>{
    try{
       const actors=await Actor.find();
       if(!actors || actors.length==0){
         res.status(404).send("no actor data found");
         return;
       }

       const data={
         actors:actors.map(m=>m.toJSON()),
       }

       const filename='actor.json';
       fs.writeFileSync(filename, JSON.stringify(data, null, 2));
       console.log(` actors data saved to ${filename}`);
       res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
       const file = fs.createReadStream(filename);
       file.pipe(res);
    }catch(err){
     console.error("error in fetching and downloading actor")
    }
})

  
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

    
  } catch (err) {
    console.log('Error connecting to mongodb', err);
    process.exit(1);
  }
};

startServer();
