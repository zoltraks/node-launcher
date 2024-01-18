const { v4: uuidv4 } = require('uuid')

const security = require('../include/security')
const common = require('../include/common')
const global = require('../include/global')

class Auth {
    check(req) {
        const token = security.extractBearerToken(req.headers)
        const response = security.validateAccessToken(token)
        return response
    }

    login(body) {
        const debug = process.env.DEBUG === 'true'
        const client_id = body.client_id
        const client_secret = body.client_secret
        if (!client_id || !client_secret) {
            return {
                code: 401,
                body: {
                    error: "Missing credentials",
                },
            }
        }
        let success = false
        if (process.env.CLIENT_ID === client_id && process.env.CLIENT_SECRET === client_secret) {
            success = true
        } else {
            const index = global.clients.index((e) => e.client_id === client_id && e.client_secret === client_secret)
            if (index >= 0) {
                success = true
            }
        }
        if (!success) {
            return {
                code: 401,
                body: {
                    error: "Bad credentials",
                },
            }
        }
        if (debug) {
            common.info(`Authenticated client "${client_id}"`)
        }
        const payload = {
            client_id: client_id,
            uuid: uuidv4(),
        }
        const token = security.generateAccessToken(payload)
        const result = {
            code: 200,
            body: {
                token: token,
            },
        }
        return result
    }
}

/**
 * Authentication controller
 * @module auth
 * @exports {instance}
 */
module.exports = new Auth()
