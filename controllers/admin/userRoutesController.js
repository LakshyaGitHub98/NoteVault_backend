const services=require('../../services/admin/UserRoutesServices');
const User = require("../../models/user");
const mongoose=require("mongoose");

class UserRoutesController {
    // Sample method for getting all users (for demonstration purposes)
    async getAllUsers(req, res) {
        const users = await services.getAllUsers();
        res.send(users);
    }

    async getUserById(req, res) {
        try {
            const userId = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log("Received invalid userId:", userId);
            return res.status(400).json({ error: 'Invalid userId format' });
            }

            const user = await User.findById(userId);
            if (!user) {
            return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }



    async createUser(req, res) {
        const newUser = req.body;
        const createdUser= await services.createUser(newUser);
        res.send("User created: " + createdUser.id);
    }

    async updateUser(req, res) {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser=await services.updateUser(userId, updatedData);
        res.send(updatedUser);
    }

    async deleteUser(req, res) {
        const userId = req.params.id;
        const deletedUser=await services.deleteUser(userId);
        res.send(deletedUser);
    }

    // POST /api/user/find-id
    async getUserId(req, res) {
        try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ userId: user._id });
        } catch (error) {
            console.error("Error in findUserIdByUsername:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}

module.exports = new UserRoutesController();