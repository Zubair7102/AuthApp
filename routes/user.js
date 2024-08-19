const express = require("express");

const router = express.Router();

const {login, signup} = require("../controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middlewares/authMid")

router.post("/login", login);
router.post("/signup", signup);



// testing middleware
router.get("/test", auth, (req, res) =>{
    res.json({
        success: true,
        message: 'Welcome to the Protected route for the Test'
    })
})

// protected route
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Protectetd route for Students", 
    });
})


router.get("/admin", auth, isAdmin, (req, res) =>{
    res.json({
        success: true,
        message: 'Welcome to the Protected route for Admin'
    })
})
module.exports = router;