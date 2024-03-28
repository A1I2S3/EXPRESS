const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const { Movie } = require('./schema/moviesSchema');
const { Actor } = require('./schema/actorSchema');

const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb://localhost:27017/TECHCPY';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to check actor role
const actorMiddleware = (req, res, next) => {
    if (req.path === '/download/actors') {
        req.userRole = 'actor';
        next();
    } else {
        console.log("forbidden not allowed");
        res.status(403).send('Forbidden');
    }
};
//check director role and give acces to actor
const allowDirector = (req, res, next) => {
    if (req.headers.role === 'director') {
      req.userRole = 'director';
    } else if (req.headers.role === 'actor') {
      req.userRole = 'actor';
    }
    next();
  }
  

  async function fetchAndDownloadMovieAndActorDetails(req, res) {
    try {
      const movies = await Movie.find().populate('actors');
      const actors = await Actor.find();
  
      if (!movies || movies.length === 0) {
        res.status(404).send('No movies found');
        return;
      }
  
      if (!actors || actors.length === 0) {
        res.status(404).send('No actors found');
        return;
      }
  
      const data = {
        movies: movies.map(m => m.toJSON()),
        actors: actors.map(a => a.toJSON()),
      };
  
      const filename = 'movies_and_actors.json';
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
      console.log(`Movies and actors data saved to ${filename}`);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      const file = fs.createReadStream(filename);
      file.pipe(res);
  
    } catch (error) {
      console.error('Error fetching and saving movie and actor details:', error);
    }
  }
  


async function fetchAndDownloadActorDetails(req, res) {
    try {
        const actor = await Actor.find();
        if (!actor || actor.length === 0) {
            res.status(404).send('No actor found');
            return;
        }

        const filename = 'actor.json';
        fs.writeFileSync(filename, JSON.stringify(actor, null, 2));
        console.log(`Actor data saved to ${filename}`);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        const file = fs.createReadStream(filename);
        file.pipe(res);
    } catch (error) {
        console.error('Error fetching and saving actor details:', error);
    }
}

app.get('/download/actors', actorMiddleware, fetchAndDownloadActorDetails);


app.get('/download/movies', allowDirector, fetchAndDownloadMovieAndActorDetails);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/download`);
});
