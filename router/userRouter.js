const express = require('express');
const router = express.Router();
const { userController } = require('../controller');
const { auth } = require('../helper/jwt');

const {
    Login,
    KeepLogin,
} = userController;

router.post('/login', Login);
router.post('/keep-login', auth, KeepLogin);

module.exports = router;
