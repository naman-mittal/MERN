const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

// get config vars
dotenv.config();

function generateAccessToken(user) {
    
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }

  function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token,process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
  }

  module.exports = {generateAccessToken,authenticateToken}