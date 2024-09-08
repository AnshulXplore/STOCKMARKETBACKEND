const express = require("express");
const router = express.Router();
const Fund = require("../models/fund");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator"); // validation ke liye npm package

// ADDFUND ENDPOINT:-
router.post("/addfund",fetchuser,[
    body("enteramount","enter a amount").notEmpty().isLength({max:5}),
    body("paymentmethod","please select a method").notEmpty(),
    body("card","Please enter Valid card number").isLength({max:16}).isLength({min:16})
],
    async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({error:errors.array() });
      }

      const months = [
        'Jan', 'Feb', 'March', 'April', 'May', 'June',
        'July', 'Aug', 'Sep', 'Octo', 'Nov', 'Dec'
      ];
      
      
      const { paymentmethod,enteramount,card} = req.body;
      let userId=req.userData.Id
      const amount=await Fund.findOne({user:userId})

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

      console.log(min)

      let formatdate=`${curdate} ${months[month]} ${year}, ${formathour}:${formatmin}`
      console.log(formatdate)
    let total={}
      if(amount){
        const fund = new Fund({
            paymentmethod,
            enteramount,
            card,
            user: req.userData.Id,
            amount:enteramount,
            Date:formatdate
          });
          const saveStock = await fund.save();
         total.amount=enteramount+amount.amount
         let update=await Fund.findOneAndUpdate({user:userId},{$set:total},{new:true})  
         const lastEntry = await Fund.findOne({ user: userId }); // findone function acche se samjho jaise ek user hai anshul name ka usne apne account ki pehle entery jab uska acount bana usne apni pehli entry 7:48 pe ki or 2 doosri 8 baje or teesri 10 baje ok ab find one hamasa sabse pehli baali entry ko hi return karega to is case main anshul ki pehle entry thi 7;48 pe to ab anshul ke account main chche 2000 entry aa jaye par findone hamsesa sabse pehli matlab 7:48 baali hi return karega ok
        res.json({lastEntry,update})
      }
      //save the data in the mongo:
      else{
        const fund = new Fund({
            paymentmethod,
            enteramount,
            card,
            amount:enteramount,
            user: req.userData.Id,
            Date:formatdate
          });
          const saveStock = await fund.save();
          res.json(saveStock);
      }} catch (error) {
      console.error("Internal server error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
// GET SABHI HISTORY DEGA TRANSICTAION KI KITNE TRANSACTION ADD HUA HAI
router.get("/getdetail", fetchuser, async (req, res) => {
  try {
    const allPayment = await Fund.find({ user: req.userData.Id });
    // console.log(stock.length)
    if(allPayment.length!==0){
      const amount = await Fund.findOne({ user: req.userData.Id });
    return res.json({allPayment,amount:amount.amount});
    }
    else{
      return res.json({msg:"No History Found"});
    }
  } catch (error) {
    console.error("Internal server error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
 // YEH FUND KO UPDATE KAREGA ,KI AGAR SHARE BUY HO GYE TO FUND KO GHATA DO OR SELL HUYE TO BAPIS PLUS KAROD YEH SAB
router.put("/updatefund",fetchuser,[

],
  async (req, res) => {
  try {
    

    const months = [
      'Jan', 'Feb', 'March', 'April', 'May', 'June',
      'July', 'Aug', 'Sep', 'Octo', 'Nov', 'Dec'
    ];
    
    
    const {action,price} = req.body;
    let userId=req.userData.Id
    

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

    console.log(min)

    let formatdate=`${curdate} ${months[month]} ${year}, ${formathour}:${formatmin}`
    console.log(formatdate)
  let total={}


    if(action==='BUY'){
      
      const amount = await Fund.findOne({ user: req.userData.Id });
       let update=await Fund.findOneAndUpdate({user:userId},{$set:{amount:amount.amount-price}},{new:true})
      res.json({update})
    }
    else{
      const amount = await Fund.findOne({ user: req.userData.Id });
       let update=await Fund.findOneAndUpdate({user:userId},{$set:{amount:amount.amount+price}},{new:true})
      res.json({update})
    }
    }catch (error) {
    console.error("Internal server error:", error.message);
    res.status(500).json({ error: "Internal server error",error });
  }
}
);


module.exports = router;
