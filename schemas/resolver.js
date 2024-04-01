const User = require("../models/user.js");
const Movie = require("../models/movie.js");
const jwt = require('jsonwebtoken');
const {requireRole}=require("../middleware/verifyrole")
const axios = require('axios');
const bcrypt = require('bcryptjs');

const JWT_SECRET = "aishwarya@reddy"; 

const verifyToken = (req, res, next) => {

  const token =req.headers.authorization.split(" ")[1] ||  req.headers.authorization ;
 
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token is missing' });
  }
  jwt.verify(token, JWT_SECRET, (err,decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    return ;
  });
};
const resolvers = {
  Query:{ 
  getMovie:  async (_,{},req) => {
    try {
      
      // console.log(token)
      // const response = await axios.get('http://localhost:8080/api/movies',{ headers: { authorization: token} });  
      // return response.data
      verifyToken(req)
      const allmovies=await Movie.find({},{_id:0,__v:0,createdAt:0,updatedAt:0});
      return allmovies
      
      

    } catch (err) {
      throw new Error("Error retrieving movie");
    }
  }
  
},
Mutation :{ 
  login: async(_,{username,password})=>{

    try {
      // const response = await axios.post('http://localhost:8080/api/users/login',{username: username, password: password});
        
      // return response.data
      
      const user = await User.findOne({ username });
      if (!user) {
        return  'User not found'
      }
      //console.log(user)
     
     
      
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return 'Invalid password' 
      }
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
      return token 
       
    }catch (err) {
      throw new Error("Error retrieving user");
    }
  },
  createUser: async (_,{ username, password,role }) => {
    try {
     
  
      // const response = await axios.post('http://localhost:8080/api/users/create',{username: username, password: password, role: role});
      // return "success"

    
        
    
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return  'User already exists'
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
         return "succesfully created"

  
      
    } catch (error) {
      throw new Error( 'Internal server error' );
    }
  },


  updateUser: async (_,{ _id, username, password ,role },req) => {
    try {
      // const token=context.token
      
     

      // const response = await axios.put(`http://localhost:8080/api/users/${_id}/update`,{username: username, password: password, role: role},{ headers: { authorization: token} });
        
      // return "success updated"
      verifyToken(req)

      const  userId  = _id
      
     
      const hashedPassword = await bcrypt.hash(password, 10); // Using 10 salt rounds
      await User.findByIdAndUpdate(userId, { username, password: hashedPassword, role });
      return 'User updated successfully' 

      
    } catch (err) {
      throw new Error("Error updating user");
    }
  },
  deleteUser: async (_,{ _id },req) => {
    try {
      // const token=context.token
      // const response = await axios.delete(`http://localhost:8080/api/users/${_id}/delete`,{ headers: { authorization: token} });
        
      // return "successfully deleted"
      verifyToken(req)
      const userId  = _id;
      await User.findByIdAndDelete(userId);
      return 'User deleted successfully' 
      
    } catch (err) {
      throw new Error("Error deleting user");
    }
  }
}
};

module.exports = resolvers;