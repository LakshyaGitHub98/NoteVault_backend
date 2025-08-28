const express = require('express');
const router = express.Router();
const UserRoutesController = require('../../controllers/admin/userRoutesController');
const userRoutesController = require('../../controllers/admin/userRoutesController');


// Sample route for getting all users (for demonstration purposes)
router.get('/',(userRoutesController.getAllUsers));

router.get('/:id',(userRoutesController.getUserById));

router.post('/',(userRoutesController.createUser));

router.put('/:id',(userRoutesController.updateUser));

router.delete('/:id',(userRoutesController.deleteUser));

module.exports = router;