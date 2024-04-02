const movieService=require('../services/movieService.js');

exports.getAllMovies= async(req,res)=>{
    try{
        const movies=await  movieService.getAllMovies();
        res.json(movies);
    } catch (error){
        res.status(500).json({error:error.message});
    }
}

exports.uploadMovies= async(req,res)=>{
    try{
        let result= await  movieService.uploadMovies(req);
        if(!result) throw new Error("Error while uploading the file");
        res.status(200).json(result);
    } catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.downloadMovies= async(req,res)=>{
    try{
        await movieService.downloadMovies(req,res);
    } catch(error){
        res.status(500).json({error:error.message});
    }
}