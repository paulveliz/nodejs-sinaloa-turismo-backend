const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');


router.get('/', async (req, res) => {
    const users = await Usuario.find();
    res.json(users);
});

module.exports = router;