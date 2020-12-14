/**
 *  PATH: api/noticias
 */
const express = require('express');
const router =  express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valdiar-campos');
const { obtenerTodas, obtenerPorId, crearNueva, actualizarNoticia, cambiarEstatus } = require('../controllers/noticias');

/**
 *  Obtener todas las noticias.
 */
router.get('/todas', obtenerTodas);

/**
 * Obtener noticia por su Id.
 */
router.get('/:noticiaId', obtenerPorId)

/**
 *  Crear una nueva noticia.
 */
router.post('/nueva', [
    check('encabezado.titulo', 'El encabezado de la noticia debe tener un titulo de almenos 5 caracteres y maximo 15.')
        .not()
        .isEmpty(),
    check('encabezado.imagen', 'La imagen de encabezado es obligatoria y debe ser un URL valido.')
        .not()
        .isEmpty(),
    check('descripcion', 'La descripcion de la noticia es obligatoria y debe tener al menos 15 caracteres')
        .not()
        .isEmpty(),
    check('creado_por.usuario_id', 'El identificador del usuario es obligatorio y debe ser un valor hexadecimal.')
        .not()
        .isEmpty()
        .isHexadecimal(),
    check('creado_por.usuario_nombre', 'El nombre del usuario que creo la noticia es obligatorio.')
        .not()
        .isEmpty(),
    check('creado_por.usuario_imagen', 'El URL de la imagen del usuario es obligatoria y debe ser un URL valido.')
        .not(),
    validarCampos
], crearNueva);

/**
 *  Actualizar una noticia.
 */
router.put('/editar/:noticiaId', [
    check('encabezado.titulo', 'El encabezado de la noticia debe tener un titulo de almenos 5 caracteres y maximo 15.')
        .not()
        .isEmpty(),
    check('encabezado.imagen', 'La imagen de encabezado es obligatoria y debe ser un URL valido.')
        .not()
        .isEmpty(),
    check('descripcion', 'La descripcion de la noticia es obligatoria y debe tener al menos 15 caracteres')
        .not()
        .isEmpty(),
    validarCampos
], actualizarNoticia)

/**
 *  Cambiar estatus de una noticia.
 */
router.put('/cambiar_estatus/:noticiaId', cambiarEstatus)

module.exports = router;