var koa = require('koa');
var mount = require("koa-mount");
var graphqlHTTP = require('koa-graphql');
var app =new koa();
var schema =require('./schema/schema');
var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.1.7:27017/my_db', { useNewUrlParser: true });
 mongoose.connection.once('open',()=>{
     console.log("connected to database")
 });
app.use(mount('/graphql',graphqlHTTP({
 schema,
 graphiql: true
})))

app.listen(3000, () => {
    console.log("Server is Running.....");
});
