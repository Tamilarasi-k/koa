
var koa = require('koa');
var _ = require('koa-router');
var router = new _();

var koabody = require('koa-body')();
var app = new koa();
app.use(koabody);
var i;


var mongoose = require('mongoose');


var personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    rating: Number
});

var movie = mongoose.model("movie", personSchema);

// get 
router.get('/', async function (ctx) {

    try {
        mongoose.connect('mongodb://localhost:27017/my_db', { useNewUrlParser: true });
        var data;
        data = await movie.find({});
    }
    catch(err){
          console.log(err);
    }
    finally {
      mongoose.disconnect();
      console.log("connection closed sucessfully")
    }
    ctx.body = data;
});
//insert 
router.post('/add', async (ctx) => {
   
    try{
        mongoose.connect('mongodb://localhost:27017/my_db', { useNewUrlParser: true });
        var req = ctx.request.body;
        var data;
        var result;
       
        if (req.id != null && req.id > 0) {
            console.log(req.id);
            data = await movie.find({"id": req.id},{ "id": 1, _id: 0 });
            console.log(data)
            if(data !=null && data.length > 0) {
                result = "Data Already exists";
            }
            else {
                // data = "No Records found";
                console.log("on Else post " + req.id)
                var newdata = new movie({
                    id: req.id,
                    name: req.name,
                    rating: req.rating
                });
                newdata.save(function (err, res) {
                    console.log("Result");
                    console.log(res);
                })
                result = "in save method";
            }
        }
        else {
            result = "The Id is require";
        }
        ctx.body = result;
    
    }

    finally{
        mongoose.disconnect();
        console.log("connection closed sucessfully");       
    }




});
//

// delete
router.delete('/del/:id', async (ctx) => {
    try{
        var connection = mongoose.connect('mongodb://localhost:27017/my_db', { useNewUrlParser: true });
        var data;
        var result;
        console.log(ctx.params.id);
       
        data = await movie.findOneAndDelete({"id": ctx.params.id});
        console.log(data);
        if(data != null){
            result = "deleted successfully";
        }
        else{
            result = "Error Occured";   
        }
        ctx.body = result;
    }
    catch(err){
       console.log(err);
    }
    finally{
        mongoose.disconnect();
        console.log("disconnected sucessfully");
    }
   
});



// update
router.put('/put/:id', async (ctx) => {
    
    try{
        var connection = mongoose.connect('mongodb://localhost:27017/my_db', { useNewUrlParser: true });
        var req = ctx.request.body;
        var data;
        var result;
        data = await movie.findOneAndUpdate({ "id": ctx.params.id },
            { $set: { "id": req.id, "name": req.name, "rating": req.rating } });
        console.log(data)
        if (data != null) {
            result = "updated";
        }
        else {
            result = "data is not found";
        }
        ctx.body = result;
    }
    catch(err){
        console.log(err);
    }
    finally{
        mongoose.disconnect();
        console.log("connection closed");
    }
    
    
});



app.use(router.routes());
app.listen(3000);
