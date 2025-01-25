const userDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {this.users = data}
}
const fsPromises = require("fs").promises
const path = require("path")

const jwt = require("jsonwebtoken")
const { json } = require("stream/consumers")
require("dotenv").config()

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) // No content
    const refreshToken = cookies.jwt

    // is refreshToken in db?
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken)
    if(!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204);
    }

    // Delete refreshToken in the db
    const otherUser = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)
    const currentUser = {...foundUser, refreshToken: " "}
    userDB.setUsers = ([...otherUser, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(userDB.users)
    )

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) // secure: true - inly serves on https
    res.sendStatus(204)
}

module.exports = {
    handleLogout
}