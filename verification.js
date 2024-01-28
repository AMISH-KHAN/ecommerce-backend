const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
    var token = req.headers.authorization
    jwt.verify(token, process.env.SAULTKEYUSER, (error) => {
        if (error) {
            res.status(401).send({result:"failed",message:"you are not a authorized user"})
        }
        else {
            next()
        }
    })
}
function verifyTokenAdmin(req, res, next) {
    var token = req.headers.authorization
    jwt.verify(token, process.env.SAULTKEYADMIN, (error) => {
        if (error) {
            res.status(401).send({result:"failed",message:"you are not a authorized user"})
        }
        else {
            next()
        }
    })
}

module.exports=[verifyToken,verifyTokenAdmin]