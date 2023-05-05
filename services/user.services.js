const User = require('../models/user');

exports.createUser = async (userInfo) => {
        try {
                const { email, picture, given_name } = userInfo;
                const userData = await User.findOneAndUpdate({ email: email },{ picture: picture,username:given_name ,signup_type:'google'},{ upsert: true, new: true})
                return userData;
                
        }
        catch (err) {
                console.log(err);
                res.status(500).json({
                        error: "Server Error, failed to create user",
                });
        }
}