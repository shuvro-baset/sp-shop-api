const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const User = require('../models/User')
const router = require('express').Router();

// update user 
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            
            req.params.id, 
            {
                $set: req.body,
        }, 
        { new: true }
        );
        console.log("updatedUser: " + updatedUser)
        res.status(200).json(updatedUser);
    }
    catch(err) {
        res.status(500).json(err.message); 
    }
})


// get single User
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc;
        res.status(200).json(others);
        
    }catch(err) {
        res.status(500).json(err)
    }
})


// get all User
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
        
    }catch(err) {
        res.status(500).json(err)
    }
})

// delete user 
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted.. ")
    }catch(err) {
        res.status(500).json(err)
    }
})



module.exports = router