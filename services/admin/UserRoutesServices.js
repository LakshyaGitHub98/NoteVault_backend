const User = require("../../models/user");

class UserRoutesServices {
  async getAllUsers() {
    try {
      return await User.find();
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  }

  async getUserById(id) {
    try {
      return await User.findById(id);
    } catch (err) {
      console.error("Error fetching user by ID:", err);
      return null;
    }
  }

  async getUserFiles(id) {
    try {
      const user = await User.findById(id).populate("files");
      return user?.files || [];
    } catch (err) {
      console.error("Error fetching user files:", err);
      return [];
    }
  }

  async createUser(userData) {
    try {
      const newUser = new User(userData);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.error("Error creating user:", err);
      return null;
    }
  }

  async updateUser(id, userData) {
    try {
      return await User.findByIdAndUpdate(id, userData, { new: true });
    } catch (err) {
      console.error("Error updating user:", err);
      return null;
    }
  }

  async deleteUser(id) {
    try {
      await User.findByIdAndDelete(id);
      return true;
    } catch (err) {
      console.error("Error deleting user:", err);
      return false;
    }
  }
}

module.exports = new UserRoutesServices();