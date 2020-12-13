const jwt = require('jsonwebtoken');

const generarJTW = ( id ) => {

    return new Promise( (resolve, reject) => {

        const payload = {
            id
        };
        jwt.sign( payload, process.env.JWT_KEY, {
            expiresIn: '12h'
        }, (err, token) => {
            if(err){
                // No se creo el token
                reject('No se pudo generar el JWT.');
            }else{
                // Token
                resolve(token);
            }
        });

    });


};

module.exports = {
    generarJTW
}