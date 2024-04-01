# Movie API

A simple Express.js API for managing movies and actors.

## Features

- **Authentication and Authorization**: User authentication and authorization based on roles (director and actor).
- **User Management**: CRUD operations for users with login and proper error handling.
- :**Movie management**: Upload and download movies data as JSON files.
- **Actor management**: Upload and download actors data as JSON files.

## Tech Stack

- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Multer
- GraphQL

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/A1I2S3/EXPRESS.git
    cd EXPRESS

2.  Install dependencies:

    ```bash
    npm install

3. Configure environment variables:

    - Create a .env file in the root directory and add the following variables:
    - PORT=your_port_number
    - MONGODB_URI=your_mongodb_uri
      > Replace "your_mongodb_uri" with your actual MongoDB URI.
    - JWT_SECRET=your_jwt_secret
      > You can generate a random string of characters to use as your secret.

3. Run the server:

    ```bash 
    npm start 
    or
    nodemon express.js 

## Usage

- Make sure the server is running.
- Access the endpoints using tools like Postman at http://localhost:your_port_number.
- Refer API Documentation for a detailed usage instructions.

## API Documentation

**Express endpoints**

| Method   | Endpoint                     | Description                                       |
|----------|------------------------------|---------------------------------------------------|
| `POST`   | `/api/users/create`          | Create a new user.                                |
| `POST`   | `/api/users/login`           | User Login.                                       |
| `DELETE` | `/api/users/:userId/delete`  | Delete a user by its userId.                      |
| `PUT`    | `/api/users/:userId/update`  | Update a user by its userId.                      |
| `POST`   | `/api/movies/upload`         | Upload movies data as a JSON file.                |
| `GET`    | `/api/movies/download`       | Download movies data as a JSON file.              |
| `GET`    | `/api/movies`                | Get a list of movies.                             |
| `POST`   | `/api/actors/upload`         | Upload actors data as a JSON file.                |
| `GET`    | `/api/actors/download`       | Download actors data as a JSON file.              |

**GraphQL Schema**

- Queries
    
    - getMovies
        Fetch a list of movies.

- Mutations

    - login(username: String!,password: String!)
        User login.

    - createUser(username: String!, password: String!,role: String!)
        Create a new user.

    - updateUser(_id: ID!, username: String, password: String,role: String)
        Update user details by ID.

    - deleteUser(_id: ID!)
        Remove a user from database by ID.

**END**
