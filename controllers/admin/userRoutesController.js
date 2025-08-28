const services=require('../../services/admin/UserRoutesServices');
const User = require("../../models/user");

class UserRoutesController {
    // Sample method for getting all users (for demonstration purposes)
    async getAllUsers(req, res) {
        const users = await services.getAllUsers();
        res.send(users);
    }

    async getUserById(req, res) {
        const user=await services.getUserById(req.params.id);
        res.send(user);
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
}

module.exports = new UserRoutesController();