const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    paymentmethod: {
        type: String,
        required: true    // for daalna ye cheej jaruri hi hai
    },
    amount: {
        type: Number,
        default:0
        // this is for ye sirf ek hi user ka ho sakta hai ek se jyada user ki email same nahi honsakti isliye unique true  
    },
    enteramount:{
     type:Number,
     required:true
    },
    Date:{
        type:String
    },
    card:{
      type:Number,
      required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    
});

const Fund=mongoose.model('payment',paymentSchema);// jo ye humne userdetail diya hai iska matlab hai ki us database base main koinse collection main ye store karna hai to ye mongo main ek collection banayega userdetail name se or usme ddata enter karega. iska pehla argument hota hai collection name and second is schema name.
Fund.createIndexes();  // ek function index bana deta hai yadi hum kise field ko unique rakhte hai to ye ye uske liye alag se indexes banayega or phir agar kise user ne 123 email enter ki to phir or koi user 123 use nahi kar payega.
module.exports=Fund;       