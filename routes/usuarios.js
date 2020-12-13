const express = require('express');
const { crearUsuario } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valdiar-campos');
const router = express.Router();


router.post('/new', [
    check('telefono', 'El Telefono es obligatorio (000 - 000 - 0000).').isMobilePhone(),
    check('nombre', 'El nombre de la persona es obligatorio.').not().isEmpty(),
    check('clave', 'La contraseña es obligatoria.').not().isEmpty(),
    validarCampos
], crearUsuario );

module.exports = router;