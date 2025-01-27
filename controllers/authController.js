const userDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {this.users = data}
}

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")
require("dotenv").config()
const fsPromises = require("fs").promises
const path = require("path")

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ "message": "Username and Password are required" })

    const foundUser = userDB.users.find(person => person.username === user)
    if(!foundUser) return res.sendStatus(401); //Unauthorized

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match) {
        const roles = Object.values(foundUser.roles)
        // Create JWT
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                } 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { "expiresIn": "30s" }
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { "expiresIn": "1d" }
        )
        // saving refreshToken with current user 
        const otherUser = userDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = { ...foundUser, refreshToken }
        userDB.setUsers([...otherUser, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(userDB.users)
        )

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ accessToken })
    }else {
        res.sendStatus(401)
    }
}

module.exports = {
    handleLogin
}