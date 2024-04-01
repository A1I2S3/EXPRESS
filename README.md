# Movie API

The Movie API is a simple Express.js API with a graphql endpoint for managing movies and actors. It features user authentication and authorization based on roles (director and actor), allowing users to list, upload, and download movies and actors in json format as per the permission of roles.

## Features

- **Authentication and Authorization**: User authentication and authorization based on roles (director and actor).
- **User Management**: CRUD operations for users with login and proper error handling.
- **Movie management**: Upload and download movies data as JSON files.
- **Actor management**: Upload and download actors data as JSON files.

## Tech Stack

- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Multer
- GraphQL

## Setup

**Fork the Project**

Please fork the project at https://github.com/A1I2S3/EXPRESS.git before using it to ensure you can pull updates, submit issues, and contribute as needed.


1. Clone the repository:

    ```bash
    git clone https://github.com/your_repo/EXPRESS.git
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
- Access the graphql endpoint on http://localhost:your_port_number/graphql
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

- Note that all routes are protected, you need to send an Authorization header with a valid JWT token using tools like Postman.
- To upload a JSON file , you need to send it through form-data under key "file" using a tool like Postman.
- Please follow the below example format to upload the movie and actor files. 
    - Example movies upload file :
        >
        ```json
        {
        "movies":[
            {"title":"The Shawshank Redemption 6", "year":1994, "rating":9.3},
            {"title":"The Godfather", "year" : 1972, "rating":9.2},
            {"title":"The Godfather 7", "year" : 1980, "rating":9.3}
            ]
        }
    - Example actors upload file :
        >
        ```json
        {
            "actors":[
                {
                    "name": "Avinash",
                    "age": 32,
                    "gender":"Male"
                },
                {
                    "name":"Krishna",
                    "age": 45,
                    "gender":"Male"
                }
            ]
        }
        
**Using the GraphQL endpoint**

1. Authentication:

- Obtain an authorization token through authentication system(login).
- Include the token in the Authorization header of your requests to authenticate with the GraphQL endpoint.

2. Send Queries:

- Construct your GraphQL query using the GraphQL query language.
- Use your GraphQL client (Apollo) to send the query to the GraphQL endpoint.
- Ensure the query is properly formatted and includes all required fields.
> Example:
    ```graphql
    query {
  getMovies {
    title
    year
    rating
  }
}
```
3. Send Mutations :

- Construct your GraphQL mutation using the GraphQL query language.
- Use your GraphQL client to send the mutation to the GraphQL endpoint.
- Ensure the mutation is properly formatted and includes all required input fields.
> Example:
    ```graphql
    mutation {
  createUser(input: {username: "John", password: "password", role: "actor"}) {
    id
    name
    email
  }
}
    ```

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
