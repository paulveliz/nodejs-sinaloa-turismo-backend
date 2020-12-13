const { Schema, model } = require('mongoose');

const LugarSchema = Schema({

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
        de_pago: {
            type: Boolean,
            required: true,
        },
        precio: {
            type: Number,
            required: false,
            default: 0.0
        },
        ubicacion: {
            type: String,
            required: false,
            default: "25.82113367733769, -108.22177007685517" // Sinaloa de leyva
        }
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


LugarSchema.method('toJSON', function () {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Lugar', LugarSchema);