const User = require('../models/User');
const {  verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router=require('express').Router();

//UPDATE
router.put("/:id",verifyTokenAndAuthorization, async (req,res)=>{
    if(req.body.password){
        req.body.password=CryptoJS.AES.decrypt(user.password,process.env.PASS_SECRET_KEY).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error)
    }
});

//DELETE

router.delete("/:id",verifyTokenAndAuthorization, async (req,res)=>{
   
 try {
         await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.......");
    } catch (error) {
        res.status(500).json(error)
    }
});


//GET USER

router.get("/:id",verifyTokenAndAdmin, async (req,res)=>{
   
    try {
           const user = await User.findById(req.params.id);
           const {password,...others}=user._doc;//we need only document object
        res.status(200).json(others)
       } catch (error) {
           res.status(500).json(error)
       }
   });


   //GET ALL USER

router.get("/",verifyTokenAndAdmin, async (req,res)=>{
   const query=req.query.new //new is query name
    try {
           const users = query ? await User.find().sort({_id:-1}).limit(5) : await User.find({});
           
        res.status(200).json(users)
       } catch (error) {
           res.status(500).json(error)
       }
   });

   //USER STATS
   router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });
   
    

module.exports=router;