const dbService = require('./dbService')
const cryptoService = require('./cryptoService')
const userService = require('./userService')

module.exports = {
    
     async login({ email, password }) {
        const [ row ] = await dbService.query('SELECT userId, passwordSalt, passwordHash FROM user WHERE email = ? AND deleted = 0', [email])
        if (!row) {
            // console.log("emtpy row to false" )
            return {sessionKey: null, user: null}
            // throw new Error("User is not registered yet, please click the register link")
            // return false;
            // window.location.assign("/signup")
        }else{
            const { userId, passwordSalt, passwordHash } = row
            const pwh = cryptoService.getHash(password, passwordSalt)
            if (pwh === passwordHash) { // login successful
                // console.log("PASSWORD matches")
                const sessionKey = cryptoService.getRandomSalt()
                await dbService.query('DELETE FROM session WHERE userId = ?', [ userId ])
                await dbService.query('INSERT INTO session (sessionKey, userId) values (?, ?)', [ sessionKey, userId ])
                const user = await userService.getUser(userId)
                return { sessionKey, user }
            }
            else {
                // console.log("no match  ")
                const user = await userService.getUser(userId)
                return { sessionKey: null, user }
                // throw new Error('Invalid email/password combination')
            }
        }

    },
    async logout(sessionKey) {
        await dbService.query('DELETE FROM session WHERE sessionKey = ?', [sessionKey])
    },
    async getSession(sessionKey) {
        const [ session ] = await dbService.query('SELECT userId FROM session WHERE sessionKey = ?', [sessionKey])
        if (session) {
            const { userId } = session
            const user = await userService.getUser(userId)
            return {
                isActive: true,
                user,
            }
        }
        else {
            return {
                isActive: false,
                user: {},
            }
        }
    },
    async isNewUser(userId) {
        const [ row ] = await dbService.query('SELECT passwordHash, passwordSalt FROM user WHERE userId = ?', [ userId ])
        
        const { passwordHash, passwordSalt } = row
        const pwh = cryptoService.getHash('password', passwordSalt)
        let isNewUser = ''
        if (pwh == passwordHash) {
            isNewUser = true
        }
        else {
            isNewUser = false
        }

        return isNewUser
    }
}
