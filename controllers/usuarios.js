const bcrypt = require('bcrypt');
const { response } = require('express');
const { generarJTW } = require('../helpers/jwt');
const Usuario = require('../models/usuario');

/**
 *  CREA UN NUEVO USUARIO EN LA BASE DE DATOS
 * @param { Request } req 
 * @param { Response } res 
 */
const crearUsuario = async ( req, res = response ) => {
    const { telefono, clave } = req.body;
    try {
        /**
         *  ¿El telefono proporcionado ya existe?
        */
        const telefonoExiste = await Usuario.findOne({ telefono: telefono });
        if( telefonoExiste ) return res.status(400).json({
            ok: false,
            msg: 'El telefono ya esta registrado.'
        });

        /**
         *  Guardar nuevo usuario & encriptar su password.
        */
       const usuario =  new Usuario( req.body );
       const salt = bcrypt.genSaltSync();
       usuario.clave = bcrypt.hashSync(clave, salt);
       await usuario.save();
       /**
        *  Generamos el JsonWebToken
       */
       const token = await generarJTW( usuario.id );
       
       res.json({
            ok: true,
            usuario,
            token
       });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando crear un nuevo usuario.',
            excepcion: error
        });
    }
};

module.exports = {
    crearUsuario
}