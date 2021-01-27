const jwt = require('jsonwebtoken');
const config = require('config');


//middleware - function that intercept data and implements some logic
module.exports = (req, res, next) => { // method next allows to continue request
    if(req.method === 'OPTIONS') {  // OPTIONS - REST IP method that just check whether server available or not
        return next()
    } 

    try {
        const token = req.headers.authorization.split(' ')[1]; // string from front-end :"Bearer TOKEN" / [1] - token
        if(!token) {
            return res.status(401).json({ message: 'No authorization'});
        }

        const decoded = jwt.verify(token, config.get('jwtSecret')); // decode token
        req.user = decoded  // put token to object 'user'
        next() // continue request
    }
    catch (e) {
        res.status(401).json({ message: 'No authorization'});
    }
}