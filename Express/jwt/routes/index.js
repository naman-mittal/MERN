const userRoutes = require('./user_routes')
const songRoutes = require('./song_routes')

module.exports = function(app,db){

    userRoutes(app,db)
    songRoutes(app,db)

}