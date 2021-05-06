
const jwt = require("../controllers/jwt");

module.exports = function(app,db) {

    const users = db.collection('users')

    app.post("/login", (req, res) => {

        const {username,password} = req.body

       users.find().toArray()
       .then(results => {
        const user = results.find(u => { return u.username === username && u.password === password });

        if(user)
        {
            const accessToken = jwt.generateAccessToken({username : user.username,role : user.role})

            res.status(200).json({username,accessToken,id:user._id});
        }
        else
        {
            res.status(400).send('Incorrect username & password');
        }

       })
       .catch(error => console.error(error))

      
    });

    app.post("/signup", (req, res) => {

        users.insertOne(req.body)
        .then(result => {
          res.status(201).send('signed up successfully')
        })
        .catch(error =>{ 
            console.error(error)
        
            res.status(400).send('some error occured. Try again !')

        })
      
    });

    app.get("/users",jwt.authenticateToken, (req, res) => {

        const user = req.user

        //console.log(user)
       
        if(user.role!=='user')
        {

            users.find().toArray()
               .then(results => {
               
                res.status(200).json(results)

               })
               .catch(error => console.error(error))

        }
        else
        {
            res.status(403).send('Not authorized')
        }
      
    });

    app.get("/user/:id",jwt.authenticateToken, (req, res) => {

        const user = req.user

        //console.log(user)
       
        const id = req.params.id
       

            users.find().toArray()
               .then(results => {
               
                res.status(200).json(results)

               })
               .catch(error => console.error(error))


      
    });

}