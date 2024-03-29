const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    username: String!
    password: String!
    role: String!
  }
  type movie {
    title: String!
    year: Int!
    rating: Float!
  }

  type Query {
    getMovie: [movie]
    login(username: String!,password: String!):String!
    
  }

  type Mutation {
    createUser(username: String!, password: String!,role: String!): String
    updateUser(_id: ID!, username: String, password: String,role: String): String
    deleteUser(_id: ID!): String


     
  }
`);

module.exports = schema;