const { Schema, model } = require('mongoose');

const LugarCategoriaSchema = Schema({

    nombre: {
        type: String,
        required: true,
    },

    estatus: {
        type: Number,
        required: false,
        default: 1
    }

});

LugarCategoriaSchema.method('toJSON', function () {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('LugarCategoria', LugarCategoriaSchema);