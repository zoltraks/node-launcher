const utils = require('../include/utils')
const common = require('../include/common')

class Hello {
    world() {
        const time = utils.now()        
        const result = {
            code: 200,
            body: {
                hello: "Hello, World.",
                time: time,
            },
        }
        const debug = process.env.DEBUG === 'true'
        if (debug) {
            common.info(JSON.stringify(result, null, 2))
        }
        return result
    }

    exception() {
        try {
            throw new Error('Example Error Exception')
        } catch (error) {
            common.error(error)
            throw error
        }
    }
}

/**
 * Hello controller
 * @module hello
 * @exports {instance}
 */
module.exports = new Hello()
