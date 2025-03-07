const mongoose = require("mongoose");
const mongooseURI = "mongodb+srv://PredatorAnshul:V63qHJBCeofaH0yR@cluster0.q4vzp.mongodb.net/test?retryWrites=true&w=majority";    // stockmarket database ka name hai

const connectToMongo = () => {
   mongoose.connect(mongooseURI);
  console.log("final done");
};

module.exports = connectToMongo;
