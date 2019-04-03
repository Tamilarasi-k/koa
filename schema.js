var graphql = require('graphql');
var _ = require('lodash');// for filter
var {GraphQLObjectType,GraphQLString,GraphQLSchema} = graphql;
// dummy data
var books = [
    {name:'book1',genre:'genre1',id:'1'},
    {name:'book2',genre:'genre2',id:'2'},
    {name:'book3',genre:'genre3',id:'3'}
];


// schema
var BookType = new GraphQLObjectType({
    name :'Book',
    fields: ()=>({
      id:{type:GraphQLString},
      name:{type:GraphQLString},
      genre:{type:GraphQLString}
    })
});
var rootquery = new GraphQLObjectType({
    name :'rootquery', // any name
    fields:{
        book :{
            type:BookType,// link schema
            // list of arguments
            // to use map the id etc
            args:{
                id:{type:GraphQLString}
            },
            // parent data
            resolve(parent,args){
            // db logic like mongodb
            // use lodash for id filter
            return _.find(books,{id:args.id});

            }
        }
    }
});
module.exports = new GraphQLSchema({
    query:rootquery
});