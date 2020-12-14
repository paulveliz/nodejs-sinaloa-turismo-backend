const bcrypt = require('bcrypt');
const { response } = require('express');
const { generarJTW } = require('../helpers/jwt');
const Usuario = require('../models/usuario');

/**
 * OBTENER INFORMACION DE UN USUARIO POR SU ID
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const obtenerUsuarioPorId = async (req, res = response) => {
    const { userId } = req.params;
    try {

        /**
         *  Validar si existe el id recibido.
        */
        const usuario = await Usuario.findById({ _id: userId });
        if(!usuario) return res.status(404).json({
            ok: false,
            msg: 'El usuario no existe.'
        });

        /**
         * Retornar el usuario.
         */
        return res.json({
            ok: true,
            msg: 'Usuario encontrado.',
            usuario
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando obtener el usuario.',
            excepcion: error
        });
    }
};

/**
 *  CREA UN NUEVO USUARIO EN LA BASE DE DATOS
 * 
 * Crea un nuevo usuario con toda su respectiva informacion.
 * 
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
       
       return res.json({
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

/**
 * VALIDA EL LOGIN DE UN USUARIO.
 * 
 * Valida Telefono y contraseña del usuario.
 * 
 * @param { Request } req 
 * @param { Response } res 
 */
const login = async (req, res = response ) => {
    const { telefono, clave } = req.body;
    try {
        
        /**
         *  Validar si el telefono no existe.
         */
        const usuarioDb = await Usuario.findOne({ telefono });
        if(!usuarioDb) return res.status(404).json({
            ok: false,
            msg: 'Telefono o contraseña incorrectos.'
        });

        /**
         *  Validar la password.
         */
        const claveEsValida = bcrypt.compareSync( clave, usuarioDb.clave );
        if(!claveEsValida){
            return res.status(400).json({
                ok: false,
                msg: 'Telefono o contraseña incorrectos.'
            });
        }

        /**
         *  Generar token y retornar resultados.
         */
        const token = await generarJTW(usuarioDb.id);
        return res.json({
            ok: true,
            usuario: usuarioDb,
            token
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion al intentar iniciar sesion.',
            excepcion: error
        });
    }
};

/**
 * ACTUALIZA LA INFORMACION DEL USUARIO
 * 
 * Actualiza unicamente nombre de la persona y su telefono.
 * 
 * @param { Request } req 
 * @param { Response } res 
 */
const actualizarUsuario = async ( req, res = response  ) => {
    const { userId } = req.params;
    const { id, nombre, telefono } = req.body;
    try {
        /**
         *  Verificamos que el id del body y de los parametros sean iguales.
         */
        if(userId != id) return res.status(401).json({
            ok: false,
            msg: 'Peticion al servidor no autorizada.'
        });

        /**
         *  Nos traemos al usuario de la Db para verificar que exista.
         */
        const usuarioDB = await Usuario.findById({ _id: id });
        const verificaTelefono = await Usuario.findOne({ telefono });
        if(!usuarioDB) return res.status(404).json({
            ok: false,
            msg: 'El usuario que esta intentando modificar no existe.'
        });

        /**
         *  ¿El telefono esta ocupado por otra persona que no sea el usuario que va actualizar su info?
         */
        if(verificaTelefono && verificaTelefono.telefono != usuarioDB.telefono) return res.status(404).json({
            ok: false,
            msg: 'El telefono introducido ya esta registrado.'
        });

        /**
         *  Actualizamos el usuario con la data que venga en el body.
         */
        usuarioDB.nombre = nombre;
        usuarioDB.telefono = telefono;
        await usuarioDB.save();
        return res.json({
            ok: true,
            msg: 'La informacion del usuario fue actualizada con exito.',
            usuario: usuarioDB
            
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion al intentar editar la informacion del usuario.',
            excepcion: error
        });
    }
};

/**
 * CAMBIAR LA CONTRASEÑA DE UN USUARIO
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const cambiarClave = async (req, res = response) => {
    const { userId } = req.params;
    const { id, clave_actual, nueva_clave } = req.body;

    try {
        
        /**
         *  Validar si el id del body coincide con el params.
         */
        if(userId != id) return res.status(401).json({
            ok: false,
            msg: 'Peticion al servidor no autorizada.'
        });

        /**
         *  Validar si el usuario existe.
         */
        const usuario = await Usuario.findById({ _id: id });
        if(!usuario) return res.status(404).json({
            ok: false,
            msg: 'El usuario no existe.'
        });

        /**
         *  Validar la contraseña.
         */
        const claveValida = bcrypt.compareSync(clave_actual, usuario.clave);
        if(!claveValida) return res.status(401).json({
            ok: false,
            msg: 'La contraseña actual introducida no es correcta.'
        });

        /**
         *  Actualizar contraseña.
         */
        const salt = bcrypt.genSaltSync();
        usuario.clave = bcrypt.hashSync(nueva_clave, salt);
        usuario.save();
        return res.json({
            ok: true,
            msg: 'La contraseña fue actializada exitosamente.'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion al intentar cambiar la contraseña.',
            excepcion: error
        });
    }
};

/**
 * CAMBIAR ROL DE UN USUARIO
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const cambiarRol = async (req, res = response) => {
    const { userId } = req.params;
    const { id, nuevo_rol, admin_id } = req.body;

    try {
        /**
         *  Validar que el params y body coincidan en Id.
         */
        if(userId != id) return res.status(401).json({
            ok: false,
            msg: 'Peticion al servidor no autorizada.'
        });

        /**
         *  Validar si el adminId existe.
         */
        const userAdmin = await Usuario.findById({ _id: admin_id });
        if(!userAdmin){
            return res.status(404).json({
                ok: false,
                msg: 'El administrador no existe.'
            });
        }

        /**
         * Validar el admin que intenta cambiar el rol tiene permisos suficientes.
         */
        if(userAdmin.rol != 2){
            return res.status(400).json({
                ok: false,
                msg: 'El administrador no tiene permisos para generar esta accion'
            });
        }

        /**
         *  Valida si el usuario a cambiar rol existe.
         */
        const usuarioDb = await Usuario.findById({ _id: userId});
        if(!usuarioDb) return res.status(404).json({
            ok: false,
            msg: 'El usuario al que desea aplicar el cambio de rol, no existe.'
        });

        /**
         * Actualizamos el rol.
         */
        usuarioDb.rol = nuevo_rol;
        usuarioDb.save();
        return res.json({
            ok: true,
            msg: 'Operacion de cambio de rol exitosa.',
            usuario: usuarioDb
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion al intentar cambiar el rol a un usuario.',
            excepcion: error
        });
    }
};

/**
 *  CAMBIAR ESTATUS DE UN USUARIO
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const cambiarEstatus = (req, res = response) => {
    const { userId } = req.params;
    const { id, nuevo_estatus } = req.body;

    try {
        // TODO: IMPLEMENTAR MANEJO PARA DAR DE BAJA AL USUARIO.
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion al intentar cambiar el estatus a un usuario.',
            excepcion: error
        }); 
    }
};

module.exports = {
    crearUsuario,
    login,
    actualizarUsuario,
    cambiarClave,
    cambiarRol,
    cambiarEstatus,
    obtenerUsuarioPorId
}