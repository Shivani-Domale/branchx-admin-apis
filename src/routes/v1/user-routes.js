const express = require('express');
const router = express.Router();
const validateUser = require('../../middlewares/validate-User');
const { UserController } = require('../../controllers');


//router.post('/', validateUser, userController.createUser);

router.get('/', UserController.getAllUsers);

router.put('/:userId/status', UserController.updateUserStatus);

module.exports = router;
