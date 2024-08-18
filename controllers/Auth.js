const bcrypt = require("bcrypt");
const userData = require("../models/userData");



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