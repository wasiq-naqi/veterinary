const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config')();

module.exports = {
    generateHash: async ( string ) => {

        let salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(string, salt);

    },
    verifyHash: async ( string, hash ) => {

        return bcrypt.compare(string, hash);

    },
    generateToken: ( object ) => {

        let payload = {
            id: object.id,
            name: object.name,
            username: object.username,
            image: object.image,
            role: {
                id: object.Role.dataValues.id,
                name: object.Role.dataValues.name
            },
            labId: object.labId
        };

        let configuration = {
            subject: object.name,
            issuer: config.TOKEN.ISSUER,
            expiresIn: config.TOKEN.EXPIRY
        }

        return {
            token: jwt.sign(payload, config.TOKEN.KEY, configuration),
            timestamp: new Date()
        }
    },
    verifyToken: ( hash ) => {

        return jwt.verify(hash, config.TOKEN.KEY);
        
    },
    decodeToken: ( token ) => {

        return jwt.decode( token );
        
    }
}