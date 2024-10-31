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
app.post('/payment', (req, res) => {
    const webhookData = req.body; 

    
    console.log('Webhook received:', webhookData);

    
    res.status(200).send('Webhook received');
});

const Razorpay = require('razorpay');

// Razorpay क्लाइंट सेटअप करें
const razorpay = new Razorpay({
    key_id: 'rzp_live_iUBga0IbSkxXNc',
    key_secret: '5VVQi53mE2HaRtV3DghfIKWY',
});

// पेमेन्ट API
app.post('/create-order', async (req, res) => {
    const options = {
        amount: req.body.amount,  // पेमेन्ट राशि
        currency: "INR",
        receipt: "receipt#1",
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
    }
});



app.listen(5000);
console.log('radhe radhe');

// git commit -m "first commit"
// git push -u origin main