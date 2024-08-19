// creating three middleware
// Auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try{
        // extract jw token 
        const token = req.body.token;
        // if token is not found 
        if(!token)
        {
            return res.status(401).json({
                success: false,
                Message: 'Token Missing ',

            });
        }

        // verify the token
        try{
            // verify function takes two parameters one token and the secret key that is JWT_SECRET
            const decode = jwt.verify(token, process.env.JwT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error)
        {
            return res.status(400).json({
                success: false,
                message: "token is invalid",
            })           
        }

        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while verifying the token'
        })
    }
}


exports.isStudent = (req, res, next) =>{
    try{
        if(req.user.role !== "Student")
        {
            return res.status(401).json({
                success: false,
                message: "This is Protected routes for students"
            })
        }
        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "User Role is not matching",
        })
    }
}


exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "Admin")
        {
            return res.status(401).json({
                success: false,
                message: "This is Protected routes for Admin"
            })
        }
        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "User Role is not matching",
        })
    }
}