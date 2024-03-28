const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const movieSchema = new mongoose.Schema({
  actors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor',
    required: true,
  }],
    name:String,
    title: String,
    year: Number,
    director: String,
  },{timestamps:true});

//creating a Mongoose model named Blog based on the blogSchema schema

const Movie = mongoose.model('Movie', movieSchema);
module.exports={Movie};


