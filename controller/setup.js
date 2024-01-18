const main = require('../include/main')
const utils = require('../include/utils')

class Setup {
    async getTask(params) {
        const task = main.findTask(params.task)
        const body = task
        const result = {
            body: body,
            //code: 200,
        }
        return result
    }

    /**
     * List of configured tasks
     * 
     * @returns {Object}
     */
    async getTaskList(params) {
        let result = { }
        try {
            const main = require('../include/main')
            const list = main.listTask()
            result = {
                body: {
                    list: list,
                },
                code: 200,
            }
        } catch (error) {
            common.error(error)
            result = {
                body: {
                    exception: error.message,
                },
                code: 400,
            }
        } finally {
            result.body.time = utils.now()
            return result
        }
    }
}

/**
 * Setup controller
 * @module setup
 * @exports {instance}
 */
module.exports = new Setup()
