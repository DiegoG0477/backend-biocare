const jwt = require('jsonwebtoken');
const secretJWT = process.env.SECRET_JWT || "secret";

const verifyJWT = (req, res, next) => {
    try {
        console.log(req.get('Authorization'));

        const token = req.get('Authorization').split(' ')[1];

        console.log(token);
        
        jwt.verify(token, secretJWT, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    message: "error al validar token",
                    error: err.message
                });
            }

            req.user = decode.user;
            next();
        });
    } catch (error) {
        
        return res.status(401).json({
            message: "error al validar token",
            error: error.message
        });
    }
}

const generateToken = (user) => {
    return jwt.sign({ user }, secretJWT, { expiresIn: '24h' });
}

module.exports = { verifyJWT, generateToken };