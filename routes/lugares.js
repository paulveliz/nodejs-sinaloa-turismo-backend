/***
 *    PATH: api/lugares
***/
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { obtenerLugares, obtenerLugarPorId, crearNuevo, actualizarExistente, obtenerMasVotados, cambiarEstatus } = require('../controllers/lugares');
const { validarCampos } = require('../middlewares/valdiar-campos');

/**
 * Obtener todos los lugares por order descendente.
 */
router.get('/todos', obtenerLugares );

/**
 * Obtener los lugares mas votados.
 */
router.get('/mas_votados', obtenerMasVotados );

/**
 * Obtener un lugar por su Id.
 */
router.get('/:lugarId', obtenerLugarPorId );


/**
 * Crear un nuevo lugar
 */
router.post('/nuevo', [
    check('encabezado.titulo', 'El encabezado debe tener un titulo de al menos 3 caracteres y un maximo de 15.')
        .not()
        .isEmpty()
        .isLength({max: 15, min: 3}),
    check('encabezado.imagen', 'El encabezado debe tener una imagen representada en un url.')
        .not()
        .isEmpty(),
    check('contenido.de_pago', 'El contenido del lugar debe dar a conocer si es de pago o no (Booleano).')
        .not()
        .isEmpty()
        .isBoolean(),
    check('creado_por.id', 'Debe introducir el id del usuario.')
        .not()
        .isEmpty(),
    check('creado_por.nombre', 'Debe introducir el nombre del usuario.')
        .not()
        .isEmpty(),
    check('creado_por.imagen', 'Debe introducir la fotografia del usuario.')
        .not()
        .isEmpty(),
    validarCampos
], crearNuevo );

/**
 *  Actualizar lugar
 */
router.put('/actualizar/:lugarId', [
    check('encabezado.titulo', 'El encabezado debe tener un titulo de al menos 3 caracteres y un maximo de 15.')
        .not()
        .isEmpty()
        .isLength({max: 15, min: 3}),
    check('encabezado.imagen', 'El encabezado debe tener una imagen representada en un url.')
        .not()
        .isEmpty(),
    check('contenido.de_pago', 'El contenido del lugar debe dar a conocer si es de pago o no (Booleano).')
        .not()
        .isEmpty()
        .isBoolean(),
    validarCampos
], actualizarExistente );

/**
 * Cambia el estatus de un lugar.
 */
router.put('/cambiar_estatus/:lugarId', [
    check('id', 'El id del lugar es obligatorio.').not().isEmpty(),
    check('nuevo_estatus', 'El nuevo estatus debe ser obligatorio & en expresion numerica.').not().isEmpty().isNumeric(),
    validarCampos
], cambiarEstatus );

module.exports = router;