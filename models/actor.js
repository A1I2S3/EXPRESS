const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const actorSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required:true
    }
},{timestamps:true});

const Actor=mongoose.model('Actor',actorSchema);
module.exports=Actor;