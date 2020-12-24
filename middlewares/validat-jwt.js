const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT  = (req, res = response, next) => {
    const token = req.header('x-token');

    if(!token) return res.status(401).json({
        ok: false,
        msg: 'No hay token en la peticion'
    });

    try {
        const { id } = jwt.verify( token, process.env.JWT_KEY );
        req.uid = id;
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido.'
        });
    }
};

module.exports = {
    validarJWT
}