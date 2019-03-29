var koa = require('koa');
var _ = require('koa-router');
var koabody = require('koa-body')();

var app = new koa();
var router = new _();
app.use(koabody);

var mongoose = require('mongoose');

var personSchema = new mongoose.Schema({
    code: { type: String, require: true },
    name: { type: String, require: true },
    mobile: { type: Number },
    address: {
        line: String,
        street: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
        phone: Number,
        email: String
    },
    GSTNO: { type: String },
    DLNO: { type: String },
    active: { type: Boolean },
    createby: { type: String },
    createddate: { type: Date, default: Date.now },
    modifiedby: { type: String },
    modifieddate: { type: Date, default: Date.now }

});

var details = mongoose.model("details", personSchema);

// get data
router.get('/', async function (ctx) {
    try {
        mongoose.connect('mongodb://localhost:27017/my_db', { useNewUrlParser: true });
        console.log("connection started");
        var data;
        var result;
        data = await details.find({});
  
        if (data != null) {
            result = data;
            console.log(result);
        }
        ctx.body = result;

    }
    catch (err) {
        console.log(err);
    }
    finally {
        mongoose.disconnect();
        console.log("connection closed")
    }

});

// insert data

router.post('/add', async (ctx) => {

    try {
        mongoose.connect('mongodb://localhost:27017/my_db', { useNewUrlParser: true });
        console.log("connection started");
        var req = ctx.request.body;
        var data;
        var result;
        if (req.code!=null && req.name !=null&&req.mobile!=null&&req.address.line&&
            req.address.street!=null &&req.address.city!=null &&req.address.state!=null &&
            req.address.country!=null &&req.address.pincode!=null &&req.address.phone!=null &&
            req.address.email!=null && req.GSTNO!=null &&req.DLNO!=null 
            &&req.active!=null &&req.createby!=null && req.modifiedby!=null) {
            
            data = await details.find({ "code": req.code });
               console.log("request id " + req.code);
            if (data.length > 0) {
                result = req.code + " already exists";
                console.log(result);
            }
            else {
               // console.log('else' + req)
               
                //console.log('else' + req.address.line)
                var newdata = new details({
                    code: req.code,
                    name: req.name,
                    mobile: req.mobile,
                    address:
                    {
                        line: req.address.line,
                        street: req.address.street,
                        city: req.address.city,
                        state: req.address.state,
                        country: req.address.country,
                        pincode: req.address.pincode,
                        phone: req.address.phone,
                        email: req.address.email
                    },
                    GSTNO: req.GSTNO,
                    DLNO: req.DLNO,
                    active: req.active,
                    createby: req.createby,
                    modifiedby: req.modifiedby,
                 
                });
                newdata.save(function (res, err) {

                });
                result = "data saved";
                console.log(result)
            }
        }
        else{
            result =" please fill the all details";

        }
        ctx.body = result;
       
    }
    catch (err) {
        console.log(err);
    }
    finally {
        // mongoose.disconnect();
        console.log("connection closed")
    }

});

// delete data

router.delete('/del/:code', async (ctx) => {
    try {
        mongoose.connect('mongodb://localhost:27017/my_db', { useNewUrlParser: true });
        console.log("connection started");
        var data;
        var result;
        data = await details.findOneAndRemove({ "code": ctx.params.code });
        if (data != null) {
            result = "data deleted";
        }
        else {
            result = "data not found";
        }

        ctx.body = result;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        mongoose.disconnect();
        console.log("connecion closed");
    }
});

// update data

router.put('/put/:code', async (ctx) => {
    try {
        mongoose.connect('mongodb://localhost:27017/my_db', { useNewUrlParser: true });
        console.log("connection started");
        var req = ctx.request.body;
        var data;
        var result;
        if (req.code > 0) {
            console.log("request id " + req.code);
            data = await details.findOneAndUpdate({ "code": ctx.params.code },
                {
                    $set: {
                        "code": req.code, "name": req.name, "mobile": req.mobile,
                        "address": {
                            "line": req.line, "street": req.street, "city": req.city, "state": req.state, "country": req.country,
                            "pincode": req.pincode, "phone": req.phone, "email": req.email
                        }, "GSTNO": req.GSTNO, "DLNO": req.DLNO,
                        "active": req.active, "createby": req.createby, "createddate": req.createddate, "modifiedby": req.modifiedby,
                        "modifieddate": req.modifieddate
                    }
                });

            if (data != null) {
                result = "data updated"
            }
            else {
                result = "data not found";
            }
        }
        ctx.body = result;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        mongoose.disconnect();
        console.log("connection closed")
    }
});

app.use(router.routes());
app.listen(3000);
