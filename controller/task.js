const common = require('../include/common')
const utils = require('../include/utils')

class Task {
    /**
     * Start task
     * 
     * @param {Task} task 
     */
    async start(params) {
        const main = require('../include/main')
        const task = main.findTask(params.task)
        let result = {}
        if (!task) {
            result = {
                body: {
                    'error': 'Task not found',
                },
                code: 400,
            }
            return result
        }
        if (task.jobs > 0) {
            result = {
                body: {
                    'error': 'Job already running'
                },
                code: 400,
            }
            return result
        }
        const launcher = require('../include/launcher')
        try {
            const { job } = launcher.run(task)
            result = {
                body: {
                    'job': job.guid,
                    'time': utils.now()
                },
                code: 200,
            }
        }
        catch (error) {
            common.error(error)
            result = {
                body: {
                    exception: error.message,
                },
                code: 400,
            }
        }
        finally {
            return result
        }
    }

    getTaskInfo(params) {
        let code = 200
        const main = require('../include/main')
        const task = main.findTask(params.task)
        let body = {
            name: task.name,
        }
        let jobs = []
        if (task.jobs?.length) {
            for (const job of task.jobs) {
                let e = {
                    guid: job.guid,
                    created: job.created,
                    running: job.running,
                    stopped: job.stopped,
                }
                if (job.child) {
                    e.child = true
                }
                let buffer = {}
                if (job.stdin.length) {
                    buffer.stdin = job.stdin.length
                }
                if (job.stdout.length) {
                    buffer.stdout = job.stdout.length
                }
                if (job.stderr.length) {
                    buffer.stderr = job.stderr.length
                }
                if (Object.keys(buffer).length) {
                    e.buffer = buffer
                }
                jobs.push(e)
            }
        }
        if (Object.keys(jobs).length) {
            body.jobs = jobs
        }
        const result = {
            code: code,
            body: body,
        }
        return result
    }

    getJob(params) {
        let code = 200
        const main = require('../include/main')
        const job = main.findJob(params.job)
        let body = {
            ...job?.info()
        }
        if (!job) {
            code = 404
            body.error = "Job not found"
        }
        const result = {
            code: code,
            body: body,
        }
        return result
    }

    getJobStdout(params) {
        let code = 200
        const main = require('../include/main')
        const job = main.findJob(params.job)
        let body = {}
        if (job?.stdout) {
            body.stdout = job.stdout
        }
        if (!job) {
            code = 404
            body.error = "Job not found"
        }
        const result = {
            code: code,
            body: body,
        }
        return result
    }

    getJobStderr(params) {
        let code = 200
        const main = require('../include/main')
        const job = main.findJob(params.job)
        let body = {}
        if (job?.stderr) {
            body.stderr = job.stderr
        }
        if (!job) {
            code = 404
            body.error = "Job not found"
        }
        const result = {
            code: code,
            body: body,
        }
        return result
    }
}

/**
 * Task controller
 * @module task
 * @exports {instance}
 */
module.exports = new Task()
