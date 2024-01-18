const global = require('../include/global')
const common = require('../include/common')

class Setup {

    clientFileName

    clientFileLast

    readClientConfiguration(file) {
        try {
            const fs = require('fs')
            const content = fs.readFileSync(file, 'utf8')
            const o = JSON.parse(content)
            global.clients.clear()
            for (const e of o) {
                if (e.policy) e.policy = e.policy.toUpperCase()
                global.clients.add(e)
            }
            this.clientFileName = file
            const stats = fs.statSync(file)
            this.clientFileLast = stats.mtime
            return true
        } catch (error) {
            common.error(error)
            return false
        }
    }
    
    taskFileName

    taskFileLast

    readTaskConfiguration(file) {
        try {
            const fs = require('fs')
            const content = fs.readFileSync(file, 'utf8')
            const o = JSON.parse(content)
            global.tasks.clear()
            for (const e of o) {
                global.tasks.add(e)
            }
            this.taskFileName = file
            const stats = fs.statSync(file)
            this.taskFileLast = stats.mtime
            return true
        } catch (error) {
            common.error(`Task configuration error in ${file}`)
            common.error(error)
            return false
        }
    }
    
    getClientCount = () => global.clients.size()
    
    getTaskCount = () => global.tasks.size()
}

/**
 * Setup functions
 * @module Setup
 * @exports {instance}
 */
module.exports = new Setup()
