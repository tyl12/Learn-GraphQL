var express = require("express");
var app = express();
var { makeExecutableSchema } = require( '@graphql-tools/schema' );
//var { buildSchema } = require('graphql');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql')

//app.use('/graphql', graphhttp({ graphiql:true }));
var { graphqlHTTP } = require('express-graphql');

const authorsDB = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const booksDB = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

var typeDefs = `
  type BookType {
    id: Int!
    name: String!
    authorId: Int!
    """
    we need deep directive
    """
    author: AuthorType
  }
  type AuthorType {
    id: Int!
    name: String!
    """
    we need deep directive
    """
    books: [BookType]
  }
  type Query {
    book(id: Int):BookType
    books:[BookType]
    author(id: Int): AuthorType
    authors:[AuthorType]
  }
`;

const resolvers={
    Query: {
        book: ({id})=>{
            return booksDB.find(book=>book.id === id)
        },
        books:()=> booksDB,
        author:({id})=>{
            return authorsDB.find(author=>author.id === id)
        },
        //authors:()=>authors
        authors:()=>authorsDB,
    },
    AuthorType:{
        books: (author)=>booksDB.filter(book=>book.authorId === author.id)
    },
    BookType:{
        author: (book)=>authorsDB.find(author=>book.authorId === author.id)
    }
}
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const loggingMiddleware = (req, res, next) => {
  console.log('ip:', req.ip);
  next();
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.listen(5000., ()=>console.log("server running"))
