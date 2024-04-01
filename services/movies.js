const express=require('express');
const routes=express.Router();
const Movie=require('../models/movie.js');
const { requireRole } = require('../middleware/verifyrole.js');
const { verifyToken }= require('../middleware/verifytoken.js');
const Actor=require('../models/actor.js')
const multer=require('multer');
const path=require('path');
const fs=require('fs');

const upload = multer({ storage : multer.memoryStorage()});

routes.get('/api/movies',verifyToken,async (req,res)=>{
    const allmovies=await Movie.find({},{_id:0,__v:0,createdAt:0,updatedAt:0});
    res.json(allmovies);
  });

  routes.post("/api/movies/upload", [verifyToken,requireRole("director"),upload.single('file')], async (req, res) => {
    try {
      const jsonFile = req.file;
      if (!jsonFile) {
        return res.status(400).json({ message: 'Please upload a JSON file' });
      }
      const data = jsonFile.buffer.toString('utf8');
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

  routes.post("/api/actors/upload", [verifyToken,requireRole('director'),upload.single('file')], async (req, res) => {
    try {
      const jsonFile = req.file;
      if (!jsonFile) {
        return res.status(400).json({ message: 'Please upload a JSON file' });
      }
      const data=jsonFile.buffer.toString('utf8')
      const actorsData = JSON.parse(data);
      const newactors = actorsData.actors;
      const existingName = await Actor.distinct("name");

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
  const createDownloadsDirectory = () => {
    const downloadsPath = path.resolve(path.dirname(__dirname), 'downloads');
  
    if (!fs.existsSync(downloadsPath)) {
      fs.mkdirSync(downloadsPath);
    }
  };



  routes.get("/api/movies/download",[verifyToken,requireRole('director')],async (req,res)=>{
  createDownloadsDirectory();
     try{
        const movies=await Movie.find();
        if(!movies || movies.length==0){
          res.status(404).send("no movies found");
          return;
        }

        const data={
          movies:movies.map(m=>m.toJSON()),
        }

        const filename='./downloads/movies.json';
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`Movies and actors data saved to ${filename}`);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/json');
        const file = fs.createReadStream(filename);
        file.pipe(res);
     }catch(err){
      console.error("error in fetching and downloading movies")
      res.status(500).send("Internal Server Error");
     }
})



routes.get("/api/actors/download",[verifyToken,requireRole(['director','actor'])],async (req,res)=>{
  createDownloadsDirectory();
  try{
     const actors=await Actor.find();
     if(!actors || actors.length==0){
       res.status(404).send("no actor data found");
       return;
     }

     const data={
       actors:actors.map(m=>m.toJSON()),
     }

     const filename='./downloads/actor.json';
     fs.writeFileSync(filename, JSON.stringify(data, null, 2));
     console.log(` actors data saved to ${filename}`);
     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
     res.setHeader('Content-Type', 'application/json');
     const file = fs.createReadStream(filename);
     file.pipe(res);
  }catch(err){
   console.error("error in fetching and downloading actor")
   res.status(500).send("Internal Server Error");
  }
})

module.exports=routes; 