const jwt = require('jsonwebtoken');

// verify token 
const verifyToken = ( req, res, next) => {
    const authHeader = req.headers.token;

    
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log("verifyToken: ", token);
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if(err) res.status(403).json("Token is not valid!")
            req.user = user;
            console.log("user: " + user)
            next();
        });

    }
    else {
        return res.status(401).json("You're not authorized!")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, ()=> {
        console.log("verifyTokenAuthorization: ")
        if(req.user.id === req.params.id || req.user.isAdmin){
            console.log("req user id: ", req.user.id)
            next();
        }else {
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization};