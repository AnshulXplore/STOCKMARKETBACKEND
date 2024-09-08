const { type } = require('@testing-library/user-event/dist/type');
const mongoose=require('mongoose');
const { Schema } = mongoose;
 

const stockSchema=new Schema ({

    shareName:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,  // yehaq par hum user jab lkoi bhi ek user signup  karta hai to uski ek id banti hai jo hum jwt token main send kar rhe hai bas bohi hi store  kar rhe hai idhar par ye syntax use karke login na bolo to use jab hum signup karte na tab bop baali id. or ye iusliye kiya hai kyuki jab bhi hame us particular user ke stock find karna hai to jaise hi user koi nnew stock banayega to hum usme ye user id add kar dege or jb bo find karega to is userid se find kar dege tab usi ke notes hame milege jo bo usre hai
        ref:'user'  // rewf ka usre ka matlab hai ki usre main usre login hp rha hai or hum wahi se ye usre id la rhe hai isliye
    },
    buyPrice:{
        type:Number,
        required:true
    },
    action:{
        type:String,
        required:true
    },
    Date:{
        type:String,
        // required:true
    },
    shareNumber:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    updateNumber:{
        type:Number,
        default:0
    },
    quantityprice:{   // this field for calculation of average share price
        type:Number,
        default:0
    },
    quantity:{   // this field for calculation of average share price
        type:Number,
        default:0
    },
    average:{
        type:Number
    }

})
const Stock=mongoose.model('stock',stockSchema);
module.exports=Stock;