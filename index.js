// radhe radhe 
const express=require('express');
const connectToMongo=require('./db');
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors());
connectToMongo();

app.use('/',require('./routes/login'))
app.use('/userdetail',require('./routes/details'))
app.use('/payment',require('./routes/fund'))


app.listen(5000);
console.log('radhe radhe');