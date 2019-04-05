var graphql = require('graphql');
var _ = require('lodash');// for filter
var {GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID,GraphQLInt,GraphQLList} = graphql;

const Book = require('../models/book');
const Author = require('../models/author');

// schema import
var BookType = new GraphQLObjectType({
    name :'Book',
    fields: ()=>({ // read rootquery so we use function
        // parent
      id:{type:GraphQLID},
      name:{type:GraphQLString},
      genre:{type:GraphQLString},
      // map author
      author:{
          type:AuthorType,
          resolve(parent,args){
              // parent -- book
             // return _.find(authors,{id:parent.authorId});
             return Author.findById(parent.authorId);
          }
      }
    })
});
var AuthorType = new GraphQLObjectType({
    name :'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                //return _.filter(books,{authorId:parent.id});
                // filter for multiple data
                return Book.find({authorId: parent.id});
            }
        }    
    })
});

var rootquery = new GraphQLObjectType({
    name :'rootquery', // any name
    fields:{
        book :{
            type:BookType,// link schema
            // list of arguments
            // to use map the id 
            args:{
                id:{type:GraphQLID}
            },
            // parent data
            resolve(parent,args){
            // db logic like mongodb
            // use lodash for id filter
           // return _.find(books,{id:args.id});
           return Book.findById(args.id);

            }
        },
        author:{
            type:AuthorType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
               // return _.find(authors,{id:args.id});
               return Author.findById(args.id);
            }
        },
         // map books
         books:{
            // we shouldn't  use BookType because here books is liat so we need to use GraphQLList
           type: new GraphQLList(BookType),// declare GraphQLList
           resolve(parent,args){
              // return books ; // books array
              return Book.find({});
           }
       },
      authors:{
          type:new GraphQLList(AuthorType),
          resolve(parent,args){
              //return authors;  // authors array
              return Author.find({});
          }

      }
    }
});

const Muatation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                id:{type:GraphQLID},
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                authorId: {type: GraphQLID}
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },
        deleteBook:{
             type:BookType,
             args:{
                id:{type:GraphQLID},  
                 name:{type:GraphQLString},
                 genre:{type:GraphQLString}    
             },
             resolve(parent,args){
                 return Book.findOneAndRemove(args.name);
             }

        },
        deleteAuthor:{
            type:AuthorType,
            args:{
                id:{type:GraphQLID},
                name:{type:GraphQLString},
                age:{type:GraphQLInt}
            },
            resolve(parent,args)
            {
                return Author.findOneAndRemove(args.name);
            }
        },
        updateBook:{
            type:BookType,
            args:{
                id:{type:GraphQLID},
                name:{type:GraphQLString},
                genre:{type:GraphQLString}
            },
            resolve(parent,args){
                return Book.findOneAndUpdate({id:Book.id},{name:args.name,genre:args.genre
                });
            }
        },
        updateAuthor:{
            type:AuthorType,
            args:{
                id:{type:GraphQLID},
                name:{type:GraphQLString},
                age:{type:GraphQLInt}
            },
            resolve(parent,args){
                return Author.findOneAndUpdate({id:Author.id},{name:args.name,age:args.age});
            }
        },
         getBook:{
            type:BookType,
            args:{
                id:{type:GraphQLID},
                name:{type:GraphQLString},
                genre:{type:GraphQLString}
            },
            resolve(present,args){
                return Book.findById(args.id);
            }
        },
        getAuthor:{
            type:AuthorType,
            args:{
                id:{type:GraphQLID},
                name:{type:GraphQLString},
                age:{type:GraphQLInt}
            },
            resolve(present,args){
                return Author.findById(args.id);
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query:rootquery,
    mutation: Muatation
});
