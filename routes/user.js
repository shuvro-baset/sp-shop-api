const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');
const User = require('../models/User')
const router = require('express').Router();


router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    console.log("I am hitting: ", req.params.id)
    if (req.body.password) {
        console.log("req body password: ", req.body.password)
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
        ).toString();
    }

    try {
        console.log("try: ", req.params.id)
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


module.exports = router