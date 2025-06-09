const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user-controller');
const validateUser = require('../../middlewares/validate-User');


//router.post('/', validateUser, userController.createUser);

router.get('/', userController.getAllUsers);

router.put('/:userId/status', userController.updateUserStatus);

module.exports = router;
// This file defines the user routes for the BranchX Admin API.
// It imports the necessary modules, sets up the router, and defines the route for creating a user.