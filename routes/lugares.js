/***
 *    PATH: api/lugares
***/
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valdiar-campos');
const { obtenerLugares, obtenerLugarPorId, crearNuevo, actualizarExistente, obtenerMasVotados, cambiarEstatus, meGusta, comentar, obtenerPendientes, obtenerEliminados, crearCategoria } = require('../controllers/lugares');

/**
 * Obtener todos los lugares por order descendente.
 */
router.get('/todos', obtenerLugares );

/**
 * Obtener los lugares mas votados.
 */
router.get('/mas_votados', obtenerMasVotados );

/**
 * Obtener los lugares pendientes.
 */
router.get('/pendientes', obtenerPendientes );

/**
 * Obtener los lugares eliminados.
 */
router.get('/eliminados', obtenerEliminados );

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
        .isEmpty(),
    check('encabezado.imagen', 'El encabezado debe tener una imagen representada en un url.')
        .not()
        .isEmpty(),
    check('contenido.de_pago', 'El contenido del lugar debe dar a conocer si es de pago o no (Booleano).')
        .not()
        .isEmpty()
        .isBoolean(),
    check('creado_por.usuario_id', 'Debe introducir el id del usuario.')
        .not()
        .isEmpty(),
    check('creado_por.usuario_nombre', 'Debe introducir el nombre del usuario.')
        .not()
        .isEmpty(),
    check('creado_por.usuario_imagen', 'Debe introducir la fotografia del usuario.')
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
    check('nuevo_estatus', 'El nuevo estatus debe ser obligatorio & en expresion numerica.').not().isEmpty(),
    check('lugar_id', 'El identificador del lugar es obligatorio.').not().isEmpty(),
    check('usuario_id', 'El identificador del propietario de la publicacion es obligatorio.').not().isEmpty(),
    validarCampos
], cambiarEstatus );

/**
 * Me gusta a un lugar
 */

router.put('/me_gusta/:lugarId',[
    check('usuario_id', 'Obligatorio').not().isEmpty(),
    check('usuario_nombre', 'Obligatorio').not().isEmpty(),
    check('lugar_id', 'Obligatorio').not().isEmpty(),
    validarCampos
], meGusta);

/**
 * Comentar un lugar
 */

router.put('/comentar/:lugarId',[
    check('usuario_id', 'Obligatorio').not().isEmpty(),
    check('usuario_nombre', 'Obligatorio').not().isEmpty(),
    check('lugar_id', 'Obligatorio').not().isEmpty(),
    check('comentario', 'Obligatorio').not().isEmpty(),
    validarCampos
], comentar);


/**
 * Crear categoria
 */
router.post('/nuevo/categoria', [
    check('nombre', 'la categoria debe llevar un nombre.')
        .not()
        .isEmpty(),
    validarCampos
], crearCategoria );


module.exports = router;