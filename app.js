var koa = require('koa');
var mount = require("koa-mount");
var graphqlHTTP = require('koa-graphql');
var app =new koa();
var schema =require('./schema/schema');
 
app.use(mount('/graphql',graphqlHTTP({
 schema,
 graphiql: true
})))

app.listen(3000, () => {
    console.log("Server is Running.....");
});
