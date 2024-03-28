const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const actorSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    }
},{timestamps:true});

const Actor=mongoose.model('Actor',actorSchema);
module.exports=Actor;