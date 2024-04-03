const Movie = require('../models/movie');
const path = require('path');
const fs = require('fs');
exports.getAllMovies = async () => {
  try {
    const allmovies = await Movie.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
    if(allmovies.length===0){
      const error= new Error("No movies found");
      error.code=404;
      throw error;
    }
    return allmovies;
  } catch (error) {
    throw error;
  }
}

exports.uploadMovies = async (req) => {
  try {
    const jsonFile = req.file;
    if (!jsonFile) {
      throw new Error("Please Upload a JSON file");
    }
    const data = jsonFile.buffer.toString('utf8');
    const moviesData = JSON.parse(data);
    const newmovies = moviesData.movies;

    const existingTitles = await Movie.distinct("title");

    const moviesToAdd = newmovies.filter(movie => !existingTitles.includes(movie.title));

    if (moviesToAdd.length === 0) {
      const error= new Error('All movies already exist in the database.');
      error.code=409;
      throw error;
    }

    await Movie.insertMany(moviesToAdd);
    return { message: 'Movies added successfully' };
  } catch (err) {
    throw err;
  }
}
const createDownloadsDirectory = () => {
  const downloadsPath = path.resolve(path.dirname(__dirname), 'downloads');

  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath);
  }
};

exports.downloadMovies = async (req, res) => {
  try {
    createDownloadsDirectory();
    const movies = await Movie.find();
    if (!movies || movies.length == 0) {
      const error=new Error("No movies found");
      error.code=404;
      throw error;
    }
    const data = {
      movies: movies.map(m => m.toJSON()),
    }

    const filename = './downloads/movies.json';
    fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.log("error in writing file");
      } else {
        console.log("file has been saved sucessfully");
      }
    });
    console.log(`Movies and actors data saved to ${filename}`);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/json');
    const file = fs.createReadStream(filename);
    file.pipe(res);
  } catch (err) {
    console.error("error in fetching and downloading movies")
    throw err;
  }
}