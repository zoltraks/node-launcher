const jwt = require('jsonwebtoken')
const global = require('../include/global')

class Security {
    middleware = (req, res, next) => {
        const disable = process.env.DISABLE_SECURITY === 'true'
        if (disable) {
            next()
        } else {
            const token = this.extractBearerToken(req.headers)
            if (!token) {
                res.sendStatus(403)
            } else {
                req.token = token 
                const validation = this.validateAccessToken(token)
                const payload = validation.body
                if (payload) {
                    if (!payload.error) {
                        req.payload = payload
                        next()
                    } else {
                        res.status(validation.code).json(payload).send()
                    }
                } else {
                    res.sendStatus(validation.code)
                }        
            }
        }
    }

    generateAccessToken(payload) {
        const secret = process.env.TOKEN_SECRET
        let expire = process.env.TOKEN_EXPIRE
        if (!expire) {
            expire = '1800s'
        }
        return jwt.sign(payload, secret, { expiresIn: expire })
    }

    validateAccessToken(token) {
        const secret = process.env.TOKEN_SECRET
        let result = {
            code: 200,
        }
        try {
            // Verify the JWT token and store its payload in `body`.
            // This method throws an error if the token is invalid
            // or if it has expired according to the expiry time we set on sign in
            // or if the signature does not match
            result.body = jwt.verify(token, secret)
        } catch (e) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            // otherwise, return a bad request error
            if (e instanceof jwt.JsonWebTokenError || e instanceof jwt.TokenExpiredError) {
                result = {
                    code: 401,
                    body: {
                        error: e.message,
                    },
                }
            } else {
                result = {
                    code: 400,
                }
            }
        }
        return result
    }

    extractBearerToken(headers) {
        const bearer = headers['authorization']
        if (typeof bearer !== 'undefined') {
            const bearerSplit = bearer.split(' ')
            if (bearerSplit.length < 2) {
                return null
            }
            const bearerToken = bearerSplit[1]
            return bearerToken
        } else {
            return null
        }
    }
}

/**
 * Security middleware
 * @module security
 * @exports {instance}
 */
module.exports = new Security()
