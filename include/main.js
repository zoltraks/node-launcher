const global = require('../include/global')
const common = require('../include/common')

class Main {
    findTask(search) {
        if (search === null || search === undefined || search === '') {
            common.error('Main.findTask(none) was called')
            return null
        }
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

    listTask() {
        let list = []
        for (const task of global.tasks.records) {
            list.push({
                name: task.name,
            })
        }
        return list
    }

    findJob(search) {
        if (search === null || search === undefined || search === '') {
            common.error('Main.findJob(none) was called')
            return null
        }
        let needle = search.toLowerCase()
        let job = null
        if (!job) {
            const indexByGuid = needle == '' ? -1 : global.jobs.index((e) => e.guid ? e.guid?.toLowerCase() === needle.toLowerCase() : false)
            if (indexByGuid >= 0) {
                job = global.jobs.records[indexByGuid]
            }
        }
        if (!job) {
            const indexByName = needle == '' ? -1 : global.jobs.index((e) => e.task ? e.task?.toLowerCase() === needle : false)
            if (indexByName >= 0) {
                job = global.jobs.records[indexByName]
            }
        }
        return job
    }
}

/**
 * Main functions
 * @module Main
 * @exports {instance}
 */
module.exports = new Main()
