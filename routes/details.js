const express = require("express");
const router = express.Router();
const Stock = require("../models/Stock");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator"); // validation ke liye npm package

// is route se hum user ke sare stock details ko get karenge:
router.get("/getdetail", fetchuser, async (req, res) => {
  try {
    const stock = await Stock.find({ user: req.userData.Id });
    res.json(stock);
  } catch (error) {
    console.error("Internal server error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// is route se hum naye stock ko add karenge user ke liye:
router.post("/addstock",fetchuser,
  [
    body("shareName").notEmpty(),
    body("shareNumber").notEmpty(),
  ],async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ msg: "Your stock name is empty" ,error:errors.array()});
      }
// DATE FORMAT START:-
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

      //DATE FORMAT END

      const { shareName,buyPrice,action,shareNumber,amount} = req.body;
      let sharenam=await Stock.findOne({shareName:shareName,user:req.userData.Id})
      console.log("shareNum"+sharenam);

      if(sharenam){   // HUMNE YEH CONDITION ISLIYE LAGAYI HAI JAISE DEKHO JAB DATA ADD HO RHA HAI TO ID TO EK SET HO RHI HAI JO HUM JWT TOKEN MAIN BHEJ RHGE HAI JAB USER LOGIN HOTA HAI THEEK AB HUM DO CHEEJ KE BASE PAR DATA SEARCH KAR RHE HAI FIRST ID KYUKI IS ID KE LIYE YE SHAREnAME HAI KYA ISLIYE HUMNE YEHA PE DO FIELD DI HAI OE YE SHARENAM BAALI CONDITION ISLIYE LIKHI HAI AGAR DATA AATA HAI TO AISE UPDATE KARDO MATLAB YE STOCK ALAG SE ADD TO KAREGE ORDER HISTORY KE LIYE PAR IS SHARE KI TOTAL NUMBER KITNE HAI ISKE LIYE AGAR YE SHARE PEHLE SE HAI TO ISE US PEHLE BAALE NUMBER MAIN ADD KARDO THEEK.
        let update=await Stock.findOneAndUpdate({shareName:shareName,user:req.userData.Id},{$set:{updateNumber:shareNumber+sharenam.updateNumber,quantityprice:amount+sharenam.quantityprice,quantity:sharenam.quantity+shareNumber}},{new:true})   
        const stock = new Stock({ // YEHA PE ADD ISLIYE KIYA HAI KYUKI ORDER HISTORY BANANI PADEGI NA KOINSA ORDER THA 
          shareName,
          user: req.userData.Id,
          buyPrice,
          action,
          Date:formatdate,
          shareNumber,
          amount,
          updateNumber:update.updateNumber
          
          
        });
        const saveStock = await stock.save();
        return res.json({saveStock,update:update.updateNumber})
      }
      //save the data in the mongo:-
      else{ // YE AGAR DATA NAHI MILA TO SEEDHA ADD AKRDO BAS NAAHI HI UPDATE KARO BAS ADD KARO KYUKI FIRST ENTRY HAI
        
        const stock = new Stock({
          shareName,
          user: req.userData.Id,
          buyPrice,
          action,
          Date:formatdate,
          shareNumber,
          amount,
          updateNumber:shareNumber,
          quantityprice:amount,
          quantity:0+shareNumber


        });
          const saveStock = await stock.save();
         return res.json({saveStock,update:saveStock.updateNumber});
    }}catch (error) {
      console.error("Internal server error:", error.message);
      res.status(500).json({ error: "Internal server error" ,error});
    }
  }
);

// for update the stock :-
router.put("/updatestock", fetchuser, async (req, res) => {
// DATE FORMAT START:-
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
//DATE FORMAT END

//YE SIRF  SELL ACTION KE LIYE HAI  KYUKI JAISE HAMARE PSS 100 SHARE HAI TO HUM AGAR 100 OR BUY KARTE HAI TO BO HUMNE TO DEKH LIYA KI HAA AGAR AATA HAI TO AISE UPODATE KARDO PAR AGAR 100 SHARE BUY HUYE TO PLUS HOTA OR AGAR SELL HUYE TO MINUS HOTA ISLIYE YEH KIYA
   const {shareName,buyPrice,action,shareNumber,amount} = req.body;
  let sharenam=await Stock.findOne({shareName:shareName,user:req.userData.Id})
  console.log(sharenam.updateNumber);
  const stock = new Stock({
    shareName,
    user: req.userData.Id,
    buyPrice,
    action,
    Date:formatdate,
    shareNumber,
    amount
  });
    const saveStock = await stock.save();
   let update=await Stock.findOneAndUpdate({shareName:shareName,user:req.userData.Id},{$set:{updateNumber:sharenam.updateNumber-shareNumber,quantityprice:sharenam.quantityprice-amount,quantity:sharenam.quantity-shareNumber}},{new:true}) 

   let isZero=await Stock.findOne({user: req.userData.Id,shareName:shareName})
   if(isZero.updateNumber===0){
     let update=await Stock.updateOne({shareName:shareName,user:req.userData.Id},{$set:{quantityprice:0,quantity:0}},{new:true})
   }



   let resh=update.updateNumber
  return res.json({resh,number:isZero.updateNumber})
});

// deleat data
router.delete("/deleatstock", fetchuser, async (req, res) => {
  const { name } = req.body;

  //create a new stock
  let userId=req.userData.Id
let stockFind=await Stock.findOne({user:userId});



if(!stockFind){
    return res.status(404).json({msg:stockFind})
}
if(String(stockFind.user) !== req.userData.Id){
    return res.status(401).json({reqid:typeof(req.userId),stockFindId:typeof(JSON.stringify(stockFind.user))});
}

let deleatStock=await Stock.findOneAndDelete({name:name});
res.json({deleatStock});

});

// get user all stock route:-

router.get("/getstock/:id", fetchuser, async (req, res) => {
  const { name } = req.body;

  //create a new stock
  
let stockFind=await Stock.findById(req.params.id);

if(!stockFind){
    return res.status(404).json({msg:stockFind})
}
if(String(stockFind.user) !== req.userId){
    return res.status(401).json({reqid:typeof(req.userId),stockFindId:typeof(JSON.stringify(stockFind.user))});
}

let getStock=await Stock.find(stockFind.user.ObjectId);
res.json({getStock});

});

// get total numb er of particular share;
router.post("/onesharedetail", fetchuser, async (req, res) => { // YE ENDPONT SE HUM USN PARTICULAR SHARE KE TOTAL NUMBER KITNE HAI BO PATA KAREGE
  try {
    let {shareName}=req.body
    const stock = await Stock.findOne({shareName:shareName,user:req.userData.Id});
    if(stock){
    return res.json(stock.updateNumber);
    }
    else{
      res.json(0)
    }
  } catch (error) {
    console.error("Internal server error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// totalsharetotalNumber  
router.get("/totalsharedetail", fetchuser, async (req, res) => { // IS POINT PAR JITNE BHI STOCK HAI UNKE TOTAL NUMBER HUM PATA KAREGE JITNE BHI STOCK USER NE SELL KIYE HUE HAI.
  try {
    
    const stock = await Stock.find({user:req.userData.Id});
    // console.log(stock[0].shareName)
    if(stock){
      let reasult=[];
      
      
      let i=0
      
      stock.map((e=>{

        // console.log(e)
        if(reasult[i-1] && e.shareName===reasult[i-1].name){

      // console.log('matcgh')
        }
        else{
          
          let info={
          number:e.updateNumber,
          name:e.shareName,
          average:e.quantityprice/e.quantity,
          amount:e.quantityprice
          }
          reasult.push(info)
          i++;
        }
      }))
      // console.log(reasult)

      for(let i=0; i<reasult.length; i++){   // 
        for(let j=i+1; j<reasult.length; j++){
          if(reasult[i].name===reasult[j].name){
            // console.log(reasult[i].name,reasult[j].name,"fhgh")
            reasult[j].number=0;
            reasult[j].name="";
            reasult[j].average=0;
            // console.log('match')
          }
          else{
            continue;
          }
        }
      }
    return res.json(reasult);
    }
    else{
      res.json({msg:"NO"})
    }
  } catch (error) {
    console.error("Internal server error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/getoneshare',fetchuser,async(req,res)=>{
  const stock=await Stock.find({user:req.userData.Id,shareName:'IRFC'})
  let deleat=await Stock.deleteMany({user:req.userData.Id,shareName:"IRFC"})


  return res.json({stock,deleat})

})
module.exports = router;
