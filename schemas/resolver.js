const User = require("../models/user.js");
const Movie = require("../models/movie.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET=process.env.JWT_SECRET
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
  getMovies:  async (_,{},req) => {
    try {

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
    
      const user = await User.findOne({ username });
      if (!user) {
        return  'User not found'
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return 'Invalid password' 
      }
      const token = jwt.sign({ userId: user._id, role: user.role },JWT_SECRET);
      return token 
       
    }catch (err) {
      throw new Error("Error retrieving user");
    }
  },
  createUser: async (_,{ username, password,role }) => {
    try {
     
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