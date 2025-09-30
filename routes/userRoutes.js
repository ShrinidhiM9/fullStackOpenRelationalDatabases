const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUsername } = require('../controllers/userController');

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:username', updateUsername);

module.exports = router;
