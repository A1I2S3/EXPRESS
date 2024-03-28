const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const actorSchema = new mongoose.Schema({
    name:String,
    title: String,
    year: Number,
    actor: String,
  },{timestamps:true});

//creating a Mongoose model named Blog based on the blogSchema schema

const Actor = mongoose.model('Actor', actorSchema);
module.exports={Actor};


