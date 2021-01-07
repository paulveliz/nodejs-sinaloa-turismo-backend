const { response, json } = require('express');
const Lugar = require('../models/lugar');
const LugarCategoria = require('../models/lugar_categoria');

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
        const lugares = await Lugar.find({ estatus: 2 }).sort({ _id: -1 });
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

const obtenerPendientes = async ( req, res = response ) => {
    try {
        const lugares = await Lugar.find({ estatus: 1 }).sort({ _id: -1 });
        return res.json({
            ok: true,
            msg: 'Lugares pendientes obtenidos con exito',
            lugares
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando obtener lugares pendientes.',
            excepcion: error
        });
    }
};

const obtenerEliminados = async ( req, res = response ) => {
    try {
        const lugares = await Lugar.find({ estatus: 0 }).sort({ _id: -1 });
        return res.json({
            ok: true,
            msg: 'Lugares eliminados obtenidos con exito',
            lugares
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando obtener lugares eliminados.',
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

/**
 * ACTUALIZAR ENCABEZADO, CONTENIDO E IMAGENES DE UN LUGAR
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const actualizarExistente = async (req, res = response) => {
    const { id, encabezado, contenido, imagenes } = req.body;
    const { lugarId } = req.params;
    try {
        /**
         *  Validar params contra body
         */
        if(id != lugarId) return res.status(401).json({
            ok: false,
            msg: 'Operacion no permitida.'
        });
        
        /**
         *  Validar si el lugar es correcto.
         */
        const lugar = await Lugar.findById({ _id: id });
        if(!lugar) return res.status(404).json({
            ok: false,
            msg: 'El lugar solicidato no existe.'
        });

        /**
         *  Actualizar lugar.
         */
        lugar.encabezado = encabezado;
        lugar.contenido = contenido;
        lugar.imagenes = imagenes;
        await lugar.save();
        return res.json({
            ok: true,
            msg: 'El lugar fue actualizado con exito.',
            lugar
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno intentando actualizar la informacion de un lugar.',
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
const cambiarEstatus = async (req, res = response) => {
    const { lugarId } = req.params;
    const { usuario_id, lugar_id, nuevo_estatus } = req.body;

    try {
        /**
         *  Validar params
         */
        if(lugarId != lugar_id) return res.status(400).json({
            ok: false,
            msg: "Operacion no permitida."
        });

        /**
         *  Validar que el usuario sea el creador.
         */
         const lugar = await Lugar.findOne({
            _id: lugar_id, 
            'creado_por.usuario_id': usuario_id
        });
         if(!lugar) return res.status(404).json({
            ok: false,
            msg: "El lugar no pertenece al usuario"
         });

         /**
          *  Eliminar  lugar
          */
         lugar.estatus = nuevo_estatus;
         await lugar.save();
         return res.json({
             ok: true,
             msg: 'Estatus cambiado con exito.'
         });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion al intentar cambiar el estatus de un lugar.',
            excepcion: error
        }); 
    }
};

const meGusta = async (req, res = response) => {
    const { lugarId } = req.params;
    const { usuario_id, lugar_id, usuario_nombre } = req.body;

    try {
        /**
         *  Validar params
         */
        if(lugarId != lugar_id) return res.status(400).json({
            ok: false,
            msg: "Operacion no permitida."
        });

        /**
         *  Validar si el lugar es correcto.
         */
        const lugar = await Lugar.findById({ _id: lugar_id });
        if(!lugar) return res.status(404).json({
            ok: false,
            msg: 'El lugar solicidato no existe.'
        });

        /**
         * Validar si le tiene me gusta.
         */
        const usuarioTieneLike = lugar.me_gusta.find(e => e.usuario_id == usuario_id);
        if(usuarioTieneLike){
           const newLugar = lugar.me_gusta.filter(m => m.usuario_id != usuario_id);
           lugar.me_gusta = newLugar;
           await lugar.save();
           return res.json({
               ok: true,
               msg: 'Dejo de gustarle.',
               me_gusta: newLugar
           });
        }else{
            lugar.me_gusta.push({
                usuario_id,
                usuario_nombre
            });
            await lugar.save(); // ????
            return res.json({
                ok: true,
                msg: 'Le gusta.',
                me_gusta: lugar.me_gusta
            });
        }

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion al intentar cambiar el estatus de un lugar.',
            excepcion: error
        }); 
    }
};


const comentar = async (req, res = response) => {
    const { lugarId } = req.params;
    const { usuario_id, lugar_id, usuario_nombre, comentario } = req.body;

    try {
        /**
         *  Validar params
         */
        if(lugarId != lugar_id) return res.status(400).json({
            ok: false,
            msg: "Operacion no permitida."
        });

        /**
         *  Validar si el lugar es correcto.
         */
        const lugar = await Lugar.findById({ _id: lugar_id });
        if(!lugar) return res.status(404).json({
            ok: false,
            msg: 'El lugar solicidato no existe.'
        });

        /**
         * Comentar
         */
        lugar.comentarios.push({
            usuario_id,
            usuario_nombre,
            comentario
        });
        await lugar.save();
        // Obtener ultimo comentario acorde su fecha.
        const newComment = lugar.comentarios.reduce((a, b) => {
            return ( new Date(a.fecha) > new Date(b.fecha) && a.usuario_id == usuario_id && b.usuario_id == usuario_id) ? a : b;
        });
        return res.json({
            ok: true,
            msg: 'Comentado.',
            comentario: newComment
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion al intentar cambiar el estatus de un lugar.',
            excepcion: error
        }); 
    }
};

/**
 * Crear nueva categoria
 */
const crearCategoria = async ( req, res = response ) => {
    try {
        const lugarCat = new LugarCategoria(req.body);
        await lugarCat.save();
        return res.json({
            ok: true,
            msg: 'Categoria creada con exito',
            lugarCat
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion al intentar cambiar el estatus de un lugar.',
            excepcion: error
        }); 
    }
};

/**
 *  Obtener las categorias existentes
 */
const obtenerCategorias = async (req, res = response) => {
    try {
        const categorias = await LugarCategoria.find({estatus: 1}).sort({_id: -1});
        return res.json({
            ok: true,
            msg: 'Categorias obtenidas con exito',
            categorias
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion intentando obtener las categorias en el sistema.',
            excepcion: error
        }); 
    }
};

/**
 *  Dar de baja una categoria
 */
const cambiarCategoriaEstatus = async (req, res = response) => {
    const { categoriaId } = req.params;
    const { categoria_id, nuevo_estatus } = req.body;
    try {

        /**
         *  Validar params
         */
        if(categoriaId != categoria_id) return res.status(400).json({
            ok: false,
            msg: "Operacion no permitida."
        });

        /**
         *  Eliminar  cat
         */
        const categoria = await LugarCategoria.findById({_id: categoria_id});
        if(!categoria) return res.status(404).json({
            ok: false,
            msg: 'La categoria no existe en el sistema.'
        });
        categoria.estatus = nuevo_estatus;
        await categoria.save();
        return res.json({
            ok: true,
            msg: 'Estatus cambiado con exito.',
            categoria
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio una excepcion intentando cambiar el estatus de la categoria',
            excepcion: error
        }); 
    } 
};

module.exports = {
    obtenerLugares,
    obtenerLugarPorId,
    obtenerMasVotados,
    crearNuevo,
    actualizarExistente,
    cambiarEstatus,
    meGusta,
    comentar,
    obtenerPendientes,
    obtenerEliminados,
    crearCategoria,
    obtenerCategorias,
    cambiarCategoriaEstatus
}