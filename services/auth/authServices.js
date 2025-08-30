const User = require("../../models/user");

class AuthServices {
    async authenticateUser(username, password) {
        const user = await User.find({ username:username,password: password });
        if (user.length === 0) {
            return false; // User not found
        }
        return true;
    }   

    async registerUser(username, email, password) {
        try {
            const newUser = new User({ username, email, password });
            await newUser.save();
            return true;
        } catch (error) {
            console.error("Registration error:", error);
            return false;
        }
    }    
}

module.exports = new AuthServices();    