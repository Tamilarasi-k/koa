var koa = require('koa');
var mount = require('koa-mount');
var graphqlHTTP = require('koa-graphql');
var app =new koa();
var schema =require('./schema/schema');
// database connection
var mongoose = require('mongoose');

    mongoose.connect('mongodb://192.168.1.6/my_db', { useNewUrlParser: true });
    // mongoose.connect.once('open',()=>{
    //    console.log("connected to database");
    // });
    app.use(mount('/vendor',graphqlHTTP( {
        graphiql:true,
        schema

    })))


app.listen(3000,()=>
{
    console.log("Server running.....")
})