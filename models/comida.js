const { Schema, model } = require('mongoose');

const ComidaSchema = Schema({

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

    contenido: {
        descripcion: {
            type: String,
            required: false,
            default: "Sin descripcion"
        },
        ubicacion: {
            type: String,
            required: false,
            default: "25.82113367733769, -108.22177007685517" // Sinaloa de leyva
        },
        productos: [{
            nombre: {
                type: String,
                required: true
            },
            descripcion: {
                type: String,
                required: false,
                default: "Sin descripcion"
            },
            precio: {
                type: Number,
                required: false,
                default: 0.0
            },
            imagen: {
                type: String,
                required: true
            }
        }]
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

    imagenes: [{
        titulo: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: false,
            default: "Sin descripcion"
        },
        imagen: {
            type: String,
            required: true
        }
    }]

});

ComidaSchema.method('toJSON', function () {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Comida', ComidaSchema);