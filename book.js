var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bookSchema = new Schema({
 name:String,
 genre:String,
 authorId:String
});
module.exports=mongoose.model('Book',bookSchema); // mongoose convert the bookschema to model