const ansi = require('ansi-colors')
const listEndpoints = require('express-list-endpoints')

const global = require('../include/global')
const utils = require('../include/utils')

class Common {
    version = () => global.version

    /**
     * Print log message
     * 
     * @param {*} message
     * @param {string} severity
     * @param {{trim: boolean, spread: boolean}} opts Options
     * @param {boolean} opts.spread Split message by new lines and print lines separately
     * @param {boolean} opts.trim Trim message from leading and trailing whitespace
     */
    log(message, severity = 'message', opts = {}) {
        severity = severity.toLowerCase()
        if (typeof message === 'object') {
            if (message instanceof Error) {
                const o = {
                    name: message.name,
                    message: message.message,
                    stack: message.stack,
                }
                message = o.message
                if (severity === 'debug' || severity === 'trace') {
                    message += '\n\n' + JSON.stringify(o, null, 2)
                }
            } else { 
                message = JSON.stringify(message, null, 2)
            }
        } else {
            const hasNewLine = /[\r\n]/.test(message)
            if (hasNewLine) {
                message = '\n' + message
            }
        }
        if (opts.trim)
            message = message.trim()
        let array = []
        if (!opts.spread) {
            array.push(message)
        } else {
            array = message.split(/[\r\n]+/);
        }
        for (const item of array) {
            if (severity === 'error' || severity === 'critical' || severity === 'fatal') {
                const text = ansi.redBright(utils.now()) + ' ' + item
                console.error(text)
            } else if (severity.toLowerCase() === 'debug' || severity.toLowerCase() === 'info') {
                const text = ansi.magentaBright(utils.now()) + ' ' + item
                console.debug(text)
            } else if (severity.toLowerCase() === 'trace') {
                const text = ansi.greenBright(utils.now()) + ' ' + item
                console.debug(text)
            } else {
                const text = ansi.yellowBright(utils.now()) + ' ' + item
                console.log(text)
            }
        }
    }

    /**
     * Print error
     * 
     * @param {*} message
     * @param {string} severity
     * @param {{trim: boolean, spread: boolean}} opts Options
     * @param {boolean} opts.spread Split message by new lines and print lines separately
     * @param {boolean} opts.trim Trim message from leading and trailing whitespace
     */
    error = (error) => this.log(error, 'error')

    /**
     * Print information
     * 
     * @param {*} message
     * @param {string} severity
     * @param {{trim: boolean, spread: boolean}} opts Options
     * @param {boolean} opts.spread Split message by new lines and print lines separately
     * @param {boolean} opts.trim Trim message from leading and trailing whitespace
     */
    info = (info, opts) => this.log(info, 'info', opts)
 
    /**
     * Print trace
     * 
     * @param {*} message
     * @param {string} severity
     * @param {{trim: boolean, spread: boolean}} opts Options
     * @param {boolean} opts.spread Split message by new lines and print lines separately
     * @param {boolean} opts.trim Trim message from leading and trailing whitespace
     */
    trace = (trace, opts) => this.log(trace, 'trace', opts)
 
    /**
     * Print debug
     * 
     * @param {*} message
     * @param {string} severity
     * @param {{trim: boolean, spread: boolean}} opts Options
     * @param {boolean} opts.spread Split message by new lines and print lines separately
     * @param {boolean} opts.trim Trim message from leading and trailing whitespace
     */
    debug = (debug, opts) => this.log(debug, 'debug', opts)
 
    getMethodList(app) {
        const endpoints = listEndpoints(app)
        const list = []
        endpoints.forEach(e => {
            e.methods.forEach(m => {
                list.push(`${m} ${e.path}`)
            })
        })
        return list
    }

    printUsage() {
        console.log('' +
            'CPU' +
            ' ' +
            ansi.cyanBright('user') +
            ' ' + 
            ansi.greenBright(process.cpuUsage().user) +
            ' ' +
            ansi.magentaBright('system') +
            ' ' + 
            ansi.redBright(process.cpuUsage().system) +
            ' ' +
            '(microseconds)' +
            '')
        const sizes = [
            ansi.yellowBright('sessions') + ': '+ ansi.redBright(global.sessions.size()),
            ansi.yellowBright('keys') + ': '+ ansi.redBright(global.keys.size()),
            ansi.yellowBright('configurations') + ': '+ ansi.redBright(global.configurations.size()),
        ]
        console.log(`Record count ${sizes.join(', ')}`)
        const [ 
            sessionsLength,
            keysLength,
            configurationsLength,
        ] = [
            JSON.stringify(global.sessions).length,
            JSON.stringify(global.keys).length,
            JSON.stringify(global.configurations).length,
        ]
        const lengths = [
            ansi.yellowBright('sessions') + ': '+ ansi.redBright(sessionsLength),
            ansi.yellowBright('keys') + ': '+ ansi.redBright(keysLength),
            ansi.yellowBright('configurations') + ': '+ ansi.redBright(configurationsLength),
        ]
        console.log(`Usage by ${lengths.join(', ')} (length in JSON bytes)`)
    }

    printEnvironment() {
        console.log('' +
            ansi.bold(ansi.yellow(global.title)) +
            ' ' + 
            ansi.greenBright('Version') + 
            ' ' + 
            ansi.whiteBright(utils.getVersion()) + 
            ' ' +
            ansi.magentaBright('Platform') + 
            ' ' + 
            ansi.blueBright(utils.getPlatform().platform) +
            '')
    }

    findTask(search) {
        let needle = search
        let task = null
        if (!task) {
            const indexByName = needle == '' ? -1 : global.tasks.index((e) => e.name ? e.name.toLowerCase() === needle.toLowerCase() : false)
            if (indexByName >= 0) {
                task = global.tasks.records[indexByName]
            }
        }
        if (!task) {
            const indexByGuid = needle == '' ? -1 : global.tasks.index((e) => e.guid ? e.guid.toLowerCase() === needle.toLowerCase() : false)
            if (indexByGuid >= 0) {
                task = global.tasks.records[indexByGuid]
            }
        }
        return task
    }
}

/**
 * Common functions
 * @module common
 * @exports {instance}
 */
module.exports = new Common()
