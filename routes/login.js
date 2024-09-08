const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator"); // this is a npm package jo hame validation provide karta hai hamare data ke liye
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser=require('../middleware/fetchuser')

// create a signup route
router.post(
  "/signup",
  [
    body("email", "Enter A Valid Email!").isEmail(),
    body("name", "Name Must be A 4 Length!").isLength({ min: 4 }),
    body("pass", "Please Atleast 4 Character in the Passwoed Field!").notEmpty().isLength({min: 4}),
    body("age", "Empty Field of Age!").notEmpty(),
    body("phone", "Enter A Valid Phone!").notEmpty().isLength({min:10})
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // checking that are there errors:-
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    // checking that is user already exixts:-
    let emailExixts = await User.findOne({ email: req.body.email });

    if (emailExixts) {
      return res.json({
        errors: "there aree same email present pleased try with another email"
      });
    }

    // hum yeha salt ko genrate kar rhe hai gensalt ek function hota hai bcrypt main  jo hame ek random string deta hai or hum isme jo bhi field pass karege to us cheej ki jagah salt replace ho jayyega jaise yeha humnbe pass pass kiya to or hamara pass hai anshul to ye cheej bcrypt.hash hamare anshul ko replace kar dege salt se jokmi ek random strinmg hai or isse hum hacker se bach sdakte hai kyhuki agar hacker ne hamara password dekhbhi liya to use anshul nahi salt milaga or jo hash function hai bo oneway hota hai matlab pass se salt ka pta lag jayega but agar hamare pass salt yhai or hum password ka pata lagana chchate hai to bo nahi laga sakte. oe jab aap data dekhgoge jo ki database main store huya hai bo aapko pass nahi rhega anshul wahga pe aapko salt milaga or jaisa ki hu7m jaante hai hash one way func hai pass se salt to acheive kar sakte hai but salt se pass not posssible.OR YE SAB ISLIYE KIYA JAISE MAANO KOI HACKER HAMARE DATABASE MAIN JAKAR SAARI DETAILS LE AATA HAI TO AISA MAIN TO DIKKAT HO JAYEGA ISLIYE HUMNE BCRYPTJS KA USE KIYA YE PACKAGE MAIN  FUNCTION HOTE HAI BAHUT SE EK FUNC HAI GENSALT YE SALT GENRATE KAREGA OR AB HACKER AGAR DB SE DATA LE BHI AATA HAI TO USE PASS NHI MILGA USE MILGA SALT OR YE HASH HAI TO PASS SE SALT POSSSIBLOE BUT SALT SE PASS NOT POSSIBLE BECAUSE HASH IS ONEWAY .


// for the formate date start:-

    const months = [
      'Jan', 'Feb', 'March', 'April', 'May', 'June',
      'July', 'Aug', 'Sep', 'Octo', 'Nov', 'Dec'
    ];
    let date=new Date();
  let year=date.getFullYear();
  let month=date.getMonth();
  let curdate=date.getDate();
  let hours=date.getHours();
  let formathour;
  let min=date.getMinutes()
  let formatmin;

  if(min<10){
    formatmin="0"+min
  }
  else{
    formatmin=min;
  }

  if(hours>12){
   formathour=hours-12;
  }
  else if(hours<10){
    formathour="0"+hours
  }
  else{
    formathour=hours
  }

  let formatdate=`${curdate} ${months[month]} ${year}, ${formathour}:${formatmin}`

  // FORMATE DATE END

    // BCRPTY HUMNE PASS KE PEECHE EK RANDO STRING LAGANE KE LIYE USE KIYA BCRYPT KE NPM PAKAGE HAI OR GENSALT(10 ) KA MATLAB HAI KI 10 CHARACTER KA SALT LAGA DO THEEK JO SALT KO GENRATE KAR RHA HAI 
    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.pass, salt);

    // ye usre.create bhi express-validator   ka part hai isse hum data ko json form main send karte hai or ye mongo db main bhi save ho jayega ise se
    // or iska hum ek await use kar rhge hai is cheek ka
    let storeData = await User.create({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      pass: securePass,
      phone:req.body.phone,
      Date:formatdate
    });
    // const JWT_SECRET = "anshul";
    // const userData = {
    //   user:storeData._id
    // };
    // const jwtToken = jwt.sign(userData, JWT_SECRET);
    // console.log("user id "+userData.user.id);

    res.json({data:storeData});   // JO DATA STORE HUA HAI USE SEND KIYA HAI
  }
);

// cretae a login route  here we check email validation
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("pass", "please fil the password field").notEmpty(),
  ],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
     return res.json({ error: error.array() });
    }

    try {

      let { pass } = req.body;
      // ye findone function hame pura ek object return karke dega jisme bo email mil jayegi uski saari field retyurn karke dega
      let emailCheck = await User.findOne({ email: req.body.email });

      if(!emailCheck){
        return res.json({msg:'Incorret Email!'})
      }

      let passwordCompare = await bcrypt.compare(pass, emailCheck.pass);  // YE BCRPYT KA COMPARE FUNCTION HAI JO HUMNE PASS KE PEECHE LAGAYA THA USKO YE COMPOARE KARTA HAI 

      if (!passwordCompare) {
        return res.json({ msg: "invalid password" });
      }

      const JWT_SECRET = "anshul";
      const userData= {
        Id:emailCheck._id 
      }
      const jwtToken = jwt.sign(userData, JWT_SECRET);  // dekho hum yeha pe jwt token main userData name ka object bhej rhe hai jiske andar id key hai ok.
      res.json({ user: jwtToken ,id:userData,data:emailCheck});

      
    } catch (error) {
      console.log(error);
    }
  }
);


// get user details route :-

router.post('/userdetail', fetchuser, async (req, res) => {
  try {
    let userid = req.userData.Id;   // yeha pe hame req karne par userdata name ka onject mil rha hai jiske key hai Idor ye req fetch user se aa rhi hai ok yeha middleware work kar rha hai.
    console.log('User ID from token:', userid);  // Debug log

    if (!userid) {
      return res.status(400).send('User ID not found in token');
    }

    const user1 = await User.findById(userid).select('-pass');  // select ke andat aapk us data ki jo bhi field '-' sign lagakar aap usse skip kar sakte ho matlab baise user1 main pura bo data aata par ab isme pass field ko hata ke baaki sab field aayegi bas.
    if (!user1) {
      return res.status(404).send('User not found');
    }

    res.send(user1);
    console.log('User data:', user1);  // Debug log
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// export the route
module.exports = router;
