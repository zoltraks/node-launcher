class Global {
    constructor() {
        const utils = require('../include/utils')

        this.versionNumber = utils.getVersion()
        
        const TaskRepository = require('../repository/task')
        const taskRepository = new TaskRepository()
        this.tasks = taskRepository

        const ClientRepository = require('../repository/client')
        const clientRepository = new ClientRepository()
        this.clients = clientRepository

        const JobRepository = require('../repository/job')
        const jobRepository = new JobRepository
        this.jobs = jobRepository
    }

    clients

    tasks

    jobs
}

/**
 * Global variables
 * @module global
 * @exports {instance}
 */
module.exports = new Global()
