const { Schema, model } = require('mongoose');


const NoticiaSchema = Schema({

    encabezado: {
        titulo: {
            type: String,
            required: true
        },
        imagen: {
            type: String,
            required: true
        }
    },

    descripcion: {
        type: String,
        required: true
    },

    me_gusta: [{
        usuario_id: {
            type: String,
            required: false
        },
        usuario_nombre: {
            type: String,
            required: false
        },
        fecha: {
            type: Date,
            required: false,
            default: Date.now()
        }
    }],

    comentarios: [{
        usuario_id: {
            type: String,
            required: false
        },
        usuario_nombre: {
            type: String,
            required: false
        },
        fecha: {
            type: Date,
            required: false,
            default: Date.now()
        },
        comentario: {
            type: String,
            required: false
        }
    }],

    creado_por: {
        usuario_id: {
            type: String,
            required: true
        },
        usuario_nombre: {
            type: String,
            required: true
        },
        usuario_imagen: {
            type: String,
            required: false
        }
    },

    fecha_creacion: {
        type: Date,
        required: false,
        default: Date.now()
    },

    estatus: {
        type: Number,
        default: 1,
        required: false
    }
    
});

NoticiaSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});
module.exports = model('Noticia', NoticiaSchema);