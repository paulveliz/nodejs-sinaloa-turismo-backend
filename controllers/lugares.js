const bcrypt = require('bcrypt');
const { response } = require('express');
const { generarJTW } = require('../helpers/jwt');
const Lugar = require('../models/lugar');

/**
 * OBTENER TODOS LOS LUGARES
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const obtenerLugares = async ( req, res = response) => {
    try {
        // Obtener lugares por su ID DESC.
        const lugares = await Lugar.find().sort({ _id: -1 });
        return res.json({
            ok: true,
            msg: 'Lista de lugares obtenida con exito.',
            lugares
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando obtener los lugares.',
            excepcion: error
        });
    }
};

const obtenerLugarPorId = async (req, res = response) => {
    const { lugarId } = req.params;

    try {
        const lugar = await Lugar.findById({ _id: lugarId});
        /**
         * Validamos si el lugar existe.
         */
        if(!lugar) return res.status(404).json({
            ok: false,
            msg: 'El lugar que busca no existe.'
        });

        /**
         *  Retornamos el lugar
         */
        return res.json({
            ok: true,
            msg: 'Lugar encontrado con exito',
            lugar
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando obtener un lugar por su identificador.',
            excepcion: error
        });
    }
};

const obtenerMasVotados = async ( req, res = response ) => {
    try {
        const lugares = await Lugar.find().sort({ me_gusta: -1 });
        return res.json({
            ok: true,
            msg: 'Lugares mas votados obtenidos con exito',
            lugares
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando obtener lugares mas votados.',
            excepcion: error
        });
    }
};

/**
 * CREAR NUEVO LUGAR
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const crearNuevo = async ( req, res = response ) => {
    try {
        const lugar = new Lugar(req.body);
        await lugar.save();
        return res.json({
            ok: true,
            msg: 'Lugar creado con exito',
            lugar
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando crear un nuevo lugar.',
            excepcion: error
        });
    }
};

module.exports = {
    obtenerLugares,
    obtenerLugarPorId,
    obtenerMasVotados,
    crearNuevo
}