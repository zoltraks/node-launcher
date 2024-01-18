const common = require('../include/common')
const utils = require('../include/utils')

const Job = require('../include/job')

class Launcher {

    takeTaskJobs(task) {
        if (!task.jobs) {
            task.jobs = []
        }
        return task.jobs
    }

    run(task) {
        if (task.command && task.program) {
            throw new Error('Task configuration wrong. Both command and program properties cannot be used at the same time.')
        }

        const { spawn, exec } = require('node:child_process')

        const command = task.command

        const jobs = this.takeTaskJobs(task)

        const job = new Job()

        job.task = task.name

        job.redirectError = utils.stringToBoolean(task.redirectError)

        job.running = true

        common.log(`Job start ${job.guid}`)

        jobs.push(job)

        if (task.program) {

            let options = {
                cwd: undefined,
                env: process.env,
            }

            if (task.directory) options.cwd = task.directory

            // Start a new process
            
            const child = spawn(task.program, task.arguments, options)

            job.running = true

            job.child = child

            // Listen for outputs from the child process

            child.stdout.on('data', (data) => {
                common.log(`Job output ${job.guid}`)
                common.log('' + data)
                job.stdout.push({ 
                    text: '' + data,
                    time: utils.now(),
                })
            })

            // Listen for errors from the child process

            child.stderr.on('data', (data) => {
                common.error(`Job error ${job.guid}`)
                common.error('' + data)
                const now = utils.now()
                job.stderr.push({ 
                    text: '' + data, 
                    time: now,
                })
                if (job.redirectError) {
                    job.stdout.push({ 
                        text: '' + data, 
                        time: now,
                    })
                }
            })
            
            // Listen for error event

            // The 'error' event is emitted whenever:
            // - The process could not be spawned.
            // - The process could not be killed.
            // - Sending a message to the child process failed.
            // - The child process was aborted via the signal option
            // The 'exit' event may or may not fire after an error has occurred.
            // When listening to both the 'exit' and 'error' events,
            // guard against accidentally invoking handler functions multiple times.

            child.on('error', (err) => {
                time = utils.now()
                job.stderr.push({ 
                    text: '' + data, 
                    time: time,
                })
                if (job.redirectError) {
                    job.stdout.push({ 
                        text: '' + data, 
                        time: time,
                    })
                }
                common.error(`Job error ${job.guid} ${err}`)
            })

            // Listen for the exit event

            child.on('exit', (code, signal) => {
                job.stopped = utils.now()
                job.running = false
                job.child = null
                common.log(`Job exit ${job.guid} with code ${code} and signal ${signal}`)
            })

            // Also listen for the close event

            child.on('close', (code) => {
                job.stopped = utils.now()
                job.running = false
                job.child = null
                common.log(`Job close ${job.guid} with code ${code}`)
            })
        }

        if (task.command) {            
            exec(command, (error, stdout, stderr) => {
                job.stopped = utils.now()
                job.running = false
                if (stdout) {
                    job.stdout.push({ time: utils.now(), text: stdout })
                    common.log(`Job output ${job.guid}`)
                    common.log('' + stdout)
                }
                if (stderr) {
                    job.stderr.push({ time: utils.now(), text: stderr })
                    if (job.redirectError) {
                        job.stdout.push({ time: utils.now(), text: stderr })
                    }
                    common.error(`Job error ${job.guid}`)
                    common.error('' + stderr)
                }
                if (error) {
                    common.error(`Job error ${job.guid}`)
                    common.error('' + error)
                }
            })
        }

        if (job) {
            const global = require('../include/global')
            global.jobs.add(job)
        }

        // // Send data to the child process
        // child.stdin.write('Hello from parent!\n');

        // // Close the input stream to the child process
        // child.stdin.end();

        // In this example, the spawn function launches a new Node.js process with the specified file (childProcess.js in this case). You can replace 'node' with the path to the executable of the desired process if it's not a Node.js process. You can also pass command line arguments as an array as the second argument.

        // The child.stdout.on and child.stderr.on functions listen for the standard output and error output of the child process, respectively. You can then handle this data as you wish.

        // The child.stdin.write function allows you to send data to the child process's standard input.

        // Finally, the child.stdin.end function closes the standard input stream to the child process.

        // Make sure to handle errors and edge cases appropriately, depending on the requirements of your application.
        return { job }
    }
}

/**
 * Process launcher
 * @module launcher
 * @exports {instance}
 */
module.exports = new Launcher()
