const bcrypt = require("bcrypt");
const userData = require("../models/userData");
// importing the json web token JWT
const jwt = require("jsonwebtoken");

require("dotenv").config();


// signup
exports.signup = async(req, res) => {
    try{
        // getting the data from the request
        const {name, email, password, role} = req.body;

        // check if the user already exist or not 
        const existingUser = await userData.findOne({email});

        if(existingUser)
        {
            return res.status(400).json({
                success: false,
                message: "User Already exists ",
            })
        }


        // secure the password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
            // using the above line of code we will encrypt the password using 10 rounds
        }
        catch(error)
        {
            return res.status(500).json({
                success: false,
                message: 'Error in encrypting(hashing)'
            });
        }

        // create entry for new user
        const user = userData.create({
            name, email, password:hashedPassword, role
        })

        return res.status(200).json({
            success: true,
            message: 'User created successfully',
        });
    }
    catch(error)
    {
        console.error(error)
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "User cannot be registered, please try again later"
        })
    }
}


// login

exports.login = async (req, res) => {
    try{
        // fetch the data from the req body
        const {email, password} = req.body
        // validate email and password if they have been entered or not 
        if(!email || !password)
        {
            return res.status(400).json({
                success: false,
            message: 'Please fill the details carefully'
            });
        
        }

        // check if the user is available or not in the db 
        const user = await userData.findOne({email});

        // if not a registered user
        if(!user )
        {
            return res.status(401).json({
                success: false,
                message: 'Please signup as you are not a registered user',
            })
        }


        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        }

        // verify password and generate a JWT token
        if(await bcrypt.compare(password, user.password))
        {
            // password matched
            let token = jwt.sign(payload,
                            process.env.JWT_SECRET,
                        {
                            expiresIn: "2h",
                        });

            // putting the created token into the user
            user.token = token;
            user.password = undefined;
            const options = {
                expiresIn: new Date( Date.now() + 3*24 * 60 * 60 * 1000),
                httpOnly: true,
                // htpOnly means that the cookie can not be accessed at the client side 
            }

            // cookie takes 3 parameters cookie name, cookie data, and some options of your choice
            // here cookie name is token and we are pssing the above created token as cookie data  
            res.cookie("token", token, options).status(200).json({
                success: true,
                token, 
                user,
                message: 'User Logged in Successfully',
            })
        }
        else{
            // password did not matched
            return res.status(402).json({
                success: false,
                message: 'Password did not matched the given email'
            })
        }
    }
    catch(error)
    {
        console.error(error)
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to Login : /',
        })
    }
}