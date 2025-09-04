const services = require('../../services/auth/authServices');
const bcrypt = require('bcrypt');
const User = require('../../models/user');

class AuthController {
  async handleLoginController(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      console.log("Login attempt:", { username });

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return res.status(200).json({ userId: user._id });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async handleRegisterController(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const isRegistered = await services.registerUser(username, email, password);

      if (isRegistered) {
        return res.status(201).json({ message: 'Registration successful' });
      } else {
        return res.status(400).json({ error: 'Registration failed' });
      }
    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuthController();