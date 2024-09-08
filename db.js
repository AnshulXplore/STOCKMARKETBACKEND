const mongoose = require("mongoose");
const mongooseURI = "mongodb+srv://anshul:Q395dd4hgra_L4V@anshul1.vfwim.mongodb.net/atlas";    // stockmarket database ka name hai

const connectToMongo = () => {
   mongoose.connect(mongooseURI);
  console.log("final done");
};

module.exports = connectToMongo;
