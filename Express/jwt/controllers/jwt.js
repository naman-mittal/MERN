const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

// get config vars
dotenv.config();

function generateAccessToken(user) {
    
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }

  function generateRefreshToken(user) {
    
    return jwt.sign(user, process.env.REFRESH_SECRET);
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

  function authenticateRefreshToken(res,token)
  {

     jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
        if (err) {
            res.status(403).send("authentication failed");
        }
        console.log(user)
        const accessToken = generateAccessToken({username : user.username, role : user.role})

        console.log(accessToken)

        res.json({
            accessToken
        });
       
    });


  }

  module.exports = {generateAccessToken,generateRefreshToken,authenticateToken,authenticateRefreshToken}