var graphql = require('graphql');
var _ = require('lodash');// for filter
var {GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID,GraphQLInt,GraphQLList} = graphql;
// dummy data
var books = [
    {name:'book1',genre:'genre1',id:'1',authorId:'1'},
    {name:'book2',genre:'genre2',id:'2',authorId:'2'},
    {name:'book3',genre:'genre3',id:'3',authorId:'2'},
    {name:'book4',genre:'genre4',id:'4',authorId:'3'},
    {name:'book5',genre:'genre4',id:'5',authorId:'3'},
    {name:'book6',genre:'genre5',id:'6',authorId:'3'}

];
var authors =[
    {name:'author 1',age :23,id:'1'},
    {name:'author 2',age :34,id:'2'},
    {name:'author 3',age :45,id:'3'}
];


// schema
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
              return _.find(authors,{id:parent.authorId});
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
                return _.filter(books,{authorId:parent.id});
                // filter for multiple data
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
            return _.find(books,{id:args.id});

            }
        },
        author:{
            type:AuthorType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
                return _.find(authors,{id:args.id});
            }
        },
         // map books
         books:{
            // we shouldn't  use BookType because here books is liat so we need to use GraphQLList
           type: new GraphQLList(BookType),// declare GraphQLList
           resolve(parent,args){
               return books ; // books array
           }
       },
      authors:{
          type:new GraphQLList(AuthorType),
          resolve(parent,args){
              return authors;  // authors array
          }

      }
    }
});
module.exports = new GraphQLSchema({
    query:rootquery
});