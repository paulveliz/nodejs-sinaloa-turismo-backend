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

    comentarios: [{
        usuario: {
            type: String,
            required: true
        },
        fecha: {
            type: Date,
            required: false,
            default: Date.now()
        },
        comentario: {
            type: String,
            required: true
        }
    }],

    me_gusta: [{
        usuario: {
            type: String,
            required: true
        },
        fecha: {
            type: Date,
            required: false,
            default: Date.now()
        },
    }],
    
});

NoticiaSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});
module.exports = model('Noticia', NoticiaSchema);