const services = require('../../services/auth/authServices');
const bcrypt = require('bcrypt');
const User = require('../../models/user'); // adjust path as needed



class AuthController { 

    async handleLoginController(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
            }
            console.log("Login attempt:", req.body);
            const user = await User.findOne({ username });
            if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return res.status(200).json({ userId: user._id });
            }else {
            res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
     
    
    async handleRegisterController(req, res) {
        const { username, email, password } = req.body;
        const isRegistered = await services.registerUser(username, email, password);
        if (isRegistered) {
            res.send("Registration successful");
        } else {
            res.status(400).send("Registration failed");
        }    
    }
}

module.exports = new AuthController();