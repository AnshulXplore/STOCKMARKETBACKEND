const mongoose = require('mongoose');
const { Schema } = mongoose;
// ye hame jab bhi koi data store karnara padta hai tab hum uska ek aisa schema bana lete hai theek hai ye jarurri hai data ko store karne ke liye
const userSchema = new Schema({
    name: {
        type: String,
        required: true    // for daalna ye cheej jaruri hi hai
    },
    email: {
        type: String,
        required: true,
        // this is for ye sirf ek hi user ka ho sakta hai ek se jyada user ki email same nahi honsakti isliye unique true  
    },
    pass:{
     type:String,
     required:true
    },
    age: {
        type: Number,
    },
    phone: {
        type: Number,
    },
    Date:{
        type:String
        
    }
    
});

const User=mongoose.model('userdetail',userSchema);// jo ye humne userdetail diya hai iska matlab hai ki us database base main koinse collection main ye store karna hai to ye mongo main ek collection banayega userdetail name se or usme ddata enter karega. iska pehla argument hota hai collection name and second is schema name.
User.createIndexes();  // ek function index bana deta hai yadi hum kise field ko unique rakhte hai to ye ye uske liye alag se indexes banayega or phir agar kise user ne 123 email enter ki to phir or koi user 123 use nahi kar payega.
module.exports=User;       