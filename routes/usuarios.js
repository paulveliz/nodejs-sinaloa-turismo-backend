/***
 *      PATH: api/usuarios
*/
const express = require('express');
const { crearUsuario, login, actualizarUsuario, cambiarClave, cambiarRol, cambiarEstatus, obtenerUsuarioPorId, renewToken } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valdiar-campos');
const { validarJWT } = require('../middlewares/validat-jwt');
const router = express.Router();

/**
 *  Renovar el jwt
 */
router.get('/renew', [
    validarJWT
], renewToken);

/***
 * Obtener usuario por su Id
 */
router.get('/:userId', obtenerUsuarioPorId);

/**
 * Crea un nuevo usuario.
 */
router.post('/new', [
    check('telefono', 'El Telefono es obligatorio (000 - 000 - 0000).').isMobilePhone(),
    check('nombre', 'El nombre de la persona es obligatorio.').not().isEmpty(),
    check('clave', 'La contraseña es obligatoria.').not().isEmpty(),
    validarCampos
], crearUsuario );

/**
 * Valida inicio de sesion.
 */
router.post('/login',[
    check('telefono', 'El Telefono es obligatorio (000 - 000 - 0000).').isMobilePhone(),
    check('clave', 'La contraseña es obligatoria.').not().isEmpty(),
    validarCampos
], login);

/**
 * Edita un usuario.
 */
router.put('/editar/:userId',[
    check('id', 'El id del usuario es obligatorio.').not().isEmpty(),
    check('telefono', 'El Telefono es obligatorio (000 - 000 - 0000).').isMobilePhone(),
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    validarCampos
], actualizarUsuario);

/**
 * Cambia la contraseña de un usuario.
 */
router.put('/cambiar_clave/:userId', [
    check('id', 'El id del usuario es obligatorio.').not().isEmpty(),
    check('clave_actual', 'Debe introducir la contraseña actual.').not().isEmpty(),
    check('nueva_clave', 'Debe introducir la nueva contraseña.').not().isEmpty(),
    validarCampos
], cambiarClave);

/**
 * Cambia el rol de un usuario.
 */
router.put('/cambiar_rol/:userId', [
    check('id', 'El id del usuario es obligatorio.').not().isEmpty(),
    check('nuevo_rol', 'El nuevo rol debe ser obligatorio & en expresion numerica.').not().isEmpty().isNumeric(),
    check('admin_id', 'El Id de administrador es obligatorio.').not().isEmpty(),
    validarCampos
], cambiarRol);

/**
 * Cambia el estatus de un usuario.
 */
router.put('/cambiar_estatus/:userId', [
    check('id', 'El id del usuario es obligatorio.').not().isEmpty(),
    check('nuevo_estatus', 'El nuevo estatus debe ser obligatorio & en expresion numerica.').not().isEmpty().isNumeric(),
    validarCampos
], cambiarEstatus);
module.exports = router;