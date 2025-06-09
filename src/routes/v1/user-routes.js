const express = require('express');
const router = express.Router();
const validateUser = require('../../middlewares/validate-User');
const { UserController } = require('../../controllers');


//router.post('/', validateUser, userController.createUser);

router.get('/', UserController.getAllUsers);

router.put('/:userId/status', UserController.updateUserStatus);

module.exports = router;
// This file defines the user routes for the BranchX Admin API.
// It imports the necessary modules, sets up the router, and defines the route for creating a user.