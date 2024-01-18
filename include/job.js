const { v4: uuidv4 } = require('uuid')

const utils = require('./utils')

class Job {
    /* guid */
    guid

    /* spawned child */
    child

    /* task name */
    task

    /* created time */
    created

    /* stopped time */
    stopped

    /* running state */
    running

    stdout = []

    stderr = []

    stdin = []
    
    /* store stderr also in stdout */
    redirectError = false

    constructor() {
        this.created = utils.now()
        this.guid = uuidv4()
    }

    info() {
        let buffer = {}
        if (this.stdin && this.stdin.length) {
            buffer.stdin = this.stdin.length
        }
        if (this.stdout && this.stdout.length) {
            buffer.stdout = this.stdout.length
        }
        if (this.stderr && this.stderr.length) {
            buffer.stderr = this.stderr.length
        }
        let result = {
            created: this.created,
            task: this.task,
            running: this.running,
            stopped: this.stopped,
        }
        if (Object.keys(buffer).length) {
            result.buffer = buffer
        }
        return result
    }
}

/**
 * Job
 * @module job
 * @exports {class}
 */
module.exports = Job
