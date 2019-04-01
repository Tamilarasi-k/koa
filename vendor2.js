var koa = require('koa');
var _ = require('koa-router');
var koabody = require('koa-body')();

var app = new koa();
var router = new _();
app.use(koabody);

var mongoose = require('mongoose');


var vendorschema = new mongoose.Schema({
    order:{type:String},
    orderid:{type:Number},
    drugcode:{type:Number},
    code:String
  

});
var vendor = mongoose.model("vendor", vendorschema);

// get method
router.get('/',async(ctx)=>{
    try{
        mongoose.connect('mongodb://localhost:27017/my_db',{useNewUrlParser:true});
        console.log("connection started");
        var data;
        var result;
        data = await vendor.aggregate([{
            $lookup:{
                from:"details",
                localField:"code",
                foreignField:"code",
                as:"vendorcode"
            }
        }]);
        if(data !=null)
        {
            result = data;
        }
        ctx.body=result;
    }
    catch(err)
    {
        console.log();
    }
    finally{
        mongoose.disconnect();
        console.log("connection disconnect");
    }
});
// insert data
router.post('/post',async(ctx)=>{
try{
    mongoose.connect('mongodb://localhost:27017/my_db', { useNewUrlParser: true });
    console.log("connection start");
    var req = ctx.request.body;
    var data;
    var result;
  //  data = await vendor.find({});
  //  console.log("check data"data);
   
    console.log(req);
    console.log(req.code);
    var newdata = new vendor({
        order:req.order,
        orderid:req.orderid,
        drugcode:req.drugcode,
        code: req.code
        
    });

    console.log("newData: " + newdata);

    await newdata.save(function(err,res){
        if(err) {
            console.log("Error: " + err);
        }

        if(res) {
            console.log("Response: " + res);
        }
    });

       ctx.body=result;
}
catch(err)
{
    console.log|(err);
}
finally{
     //mongoose.disconnect();
    console.log("connection closed");
}

});

app.use(router.routes());
app.listen(3000);




