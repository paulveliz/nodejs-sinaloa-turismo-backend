const  { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    telefono: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: false,
    },
    rol: {
        type: Number,
        required: true,
        default: 0

    },
    online: {
        type: Boolean,
        required: false,
        default: false,
    },
    creado: { 
        type: Date, 
        default: Date.now() 
    },
    ultima_conexion: { 
        type: Date,
        required: false
    },
    clave: { 
        type: String,
        required: true
    },

});

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, clave, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);