const { response } = require('express');
const noticia = require('../models/noticia');
const { findById } = require('../models/noticia');
const Noticia =  require('../models/noticia');


/**
 * OBTENER TODAS LAS NOTICIAS. 
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const obtenerTodas = async (req, res = response) => {
    try {
        const noticias = await Noticia.find().sort({_id: -1});
        return res.json({
            ok: true,
            msg: 'Noticias obtenidas con exito en orden descendiente.',
            noticias
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando obtener las noticias.',
            excepcion: error
        });
    }
};

/**
 *  OBTENER UNA NOTICIA POR SU ID
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const obtenerPorId = async (req, res = response) => {
    const { noticiaId } = req.params;
    
    try {
        /**
         *  Validar si la noticia existe.
         */
        const noticia = await Noticia.findById({ _id: noticiaId});
        if(!noticia) return res.status(404).json({
            ok: false,
            msg: 'La noticia solicitada no existe.'
        });

        /**
         *  Retornar la noticia.
         */
        return res.json({
            ok: true,
            msg: 'Noticia encontrada con exito.',
            noticia
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando obtener la noticia.',
            excepcion: error
        });
    }
};

/**
 * CREAR UNA NUEVA NOTICIA
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const crearNueva = async (req, res = response) => {
    try {
        const noticia = new Noticia(req.body);
        await noticia.save();
        return res.json({
            ok: true,
            msg: 'Noticia creada con exito',
            noticia
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando crear la noticia.',
            excepcion: error
        });
    }
};

/**
 * ACTUALIZAR ENCABEZADO Y DESCRIPCION DE LA NOTICIA.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const actualizarNoticia = async (req, res = response) => {
    const { noticiaId } = req.params;
    const { id, encabezado, descripcion } = req.body;

    try {
        /**
         * Validamos body contra params
         */
        if(id != noticiaId) return res.status(401).json({
            ok: false,
            msg: 'Operacion no autorizada.'
        });

        const noticiaDb = await Noticia.findById({ _id: noticiaId });
        /**
         *  Validamos si la noticia existe.
         */
        if(!noticiaDb) return res.status(404).json({
            ok: false,
            msg: 'La noticia que intenta actualizar no existe.'
        });

        /**
         *  Actualizamos la noticia.
         */
        noticiaDb.encabezado = encabezado;
        noticiaDb.descripcion = descripcion;
        await noticiaDb.save();
        return res.json({
            ok: true,
            msg: 'Noticia actualizada con exito.',
            noticia: noticiaDb
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando actualizar la noticia.',
            excepcion: error
        });
    }
};

/**
 *  CAMBIAR ESTATUS DE UN LUGAR
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const cambiarEstatus = (req, res = response) => {
    const { noticiaId } = req.params;
    const { id, nuevo_estatus } = req.body;

    try {
        // TODO: IMPLEMENTAR MANEJO PARA DAR DE BAJA.
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion al intentar cambiar el estatus de un lugar.',
            excepcion: error
        }); 
    }
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crearNueva,
    actualizarNoticia,
    cambiarEstatus
}