var express = require("express");
var app = express();

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql')
var { buildSchema } = require('graphql');

//app.use('/graphql', graphhttp({ graphiql:true }));
var { graphqlHTTP } = require('express-graphql');

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

var schema = buildSchema(`
  type BookType {
    id: Int!
    name: String!
    authorId: Int!
    author: AuthorType
  }
  type AuthorType {
    id: Int!
    name: String!
    books: [BookType]
  }
  type Query {
    book(id: Int):BookType
    books:[BookType]
    author(id: Int): AuthorType
    authors:[AuthorType]
  }
`);

var root = {
  book: ({id})=>{
      return books.find(book=>book.id === id)
  },
  books:()=> books,
  author:({id})=>{
      return authors.find(author=>author.id === id)
  },
  //authors:()=>authors
  authors:()=>authors,
    /*
    {
      let objs = new Array();
      //let objs=[];
      let obj=new Object;
      authors.map(auth=>{
          console.log("books=", books)
          console.log("auth=", auth)
          let bs = books.filter(book=>book.authorId===auth.id)
          console.log("     =>books=", bs)
          let obj={
              books: bs,
              id: auth.id,
              name: auth.name
          }
          //console.log("     ",obj)
          objs.push(obj)
      })
      return objs
  }
  */
}

const loggingMiddleware = (req, res, next) => {
  console.log('ip:', req.ip);
  next();
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(5000., ()=>console.log("server running"))
