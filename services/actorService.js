const Actor = require('../models/actor');
const path = require('path');
const fs = require('fs');

exports.uploadActors = async (req) => {
  try {
    const jsonFile = req.file;
    if (!jsonFile) {
      const error= new Error("Please Upload a JSON file");
      error.code=400;
      throw error;
    }
    const data = jsonFile.buffer.toString('utf8')
    const actorsData = JSON.parse(data);
    const newactors = actorsData.actors;
    const existingName = await Actor.distinct("name");

    const actorsToAdd = newactors.filter(actor => !existingName.includes(actor.name));
    if (actorsToAdd.length === 0) {
      const error= new Error('All actors already exist in the database.');
      error.code=409;
      throw error;
    }

    await Actor.insertMany(actorsToAdd);
    return { message: 'Actors added successfully' };
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

exports.downloadActors = async (req, res) => {
  try {
    createDownloadsDirectory();
    const actors = await Actor.find();
    if (!actors || actors.length == 0) {
      const error=new Error("no actor data found");
      error.code=404;
      throw error;
    }

    const data = {
      actors: actors.map(m => m.toJSON()),
    }

    const filename = './downloads/actor.json';
    fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.log("error in writing file", err);
      } else {
        console.log("file has been saved sucessfully");
      }
    });
    console.log(` actors data saved to ${filename}`);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/json');
    //This stream can be used to read data from the specified file asynchronously.
    const file = fs.createReadStream(filename);
    //This method in Node.js is used to take the output from one stream and feed it into another stream.
    file.pipe(res);
  } catch (err) {
    console.error("error in fetching and downloading actors")
    throw err;
  }
}