/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                         //
//                                                                                                                                         //
//  8 8888                  .8.       8 8888        88 b.             8    ,o88888888o.    8 8888        8 8 88888888888  8 888888888o.    //
//  8 8888                 .888.      8 8888        88 888o.          8   8888      `888.  8 8888        8 8 8888         8 8888    `88.   //
//  8 8888                :88888.     8 8888        88 Y88888o.       8 , 8888       `88.  8 8888        8 8 8888         8 8888     `88   //
//  8 8888               . `88888.    8 8888        88 .`Y888888o.    8 8 8888             8 8888        8 8 8888  o      8 8888     ,88   //
//  8 8888              .8. `88888.   8 8888        88 8o. `Y888888o. 8 8 8888             8 8888        8 8 888888888    8 8888.   ,88'   //
//  8 8888             .8`8. `88888.  8 8888        88 8`Y8o. `Y88888o8 8 8888             8 8888        8 8 8888  o      8 888888888P'    //
//  8 8888            .8' `8. `88888. 8 8888        88 8   `Y8o. `Y8888 8 8888             8 8888888888888 8 8888         8 8888`8b        //
//  8 8888           .8'   `8. `88888.` 8888       ,8P 8      `Y8o. `Y8 ` 8888       .88'  8 8888        8 8 8888         8 8888 `8b.      //
//  8 8888          .888888888. `88888. 8888     ,d8P  8         `Y8o.`   8888      ,888'  8 8888        8 8 8888         8 8888   `8b.    //
//  8 888888888888 .8'       `8. `88888. `Y8888888P'   8            `Yo    `888888888P'    8 8888        8 8 88888888888  8 8888     `88.  //
//                                                                                                                                         //
//                                                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const listEndpoints = require('express-list-endpoints')
const ansi = require('ansi-colors')

const route_auth = require('./route/auth')
const route_hello = require('./route/hello')
const route_setup = require('./route/setup')
const route_task = require('./route/task')
const route_job = require('./route/job')

const swaggerDescription = require('./resource/description.json')
const swaggerDescriptionHtml = fs.readFileSync('./resource/description.html', { encoding: 'utf8', flag: 'r' })
const swaggerDocument = '/swagger.json'

const utils = require('./include/utils')
const setup = require('./include/setup')
const common = require('./include/common')

// Set the stack trace limit to a desired number of lines
Error.stackTraceLimit = 11

// Override the default stack trace format
Error.prepareStackTrace = (error, stack) => `${error.message}\n` +
    stack.map(frame => utils.filterStackFrame(frame, __dirname)).join('\n')

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: swaggerDescription.title,
            description: swaggerDescriptionHtml
        },
		components: {
            securitySchemes: {
                JWT: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            JWT: []
        }],
    },
    apis: [
    './route/*.js',
    ]
}

dotenv.config({ path: 'server.env' })

process.env.DEBUG = !!process.env.DEBUG
process.env.EXAMPLE = !!process.env.EXAMPLE
process.env.DISABLE_ANSI = !!process.env.DISABLE_ANSI

if (process.env.DISABLE_ANSI === 'true') {
	ansi.enabled = false
}

if (!process.env.CLIENT_FILE) {
    process.env.CLIENT_FILE = 'client.json'
}

if (!process.env.TASK_FILE) {
    process.env.TASK_FILE = 'task.json'
}

if (process.env.DEBUG) {
    const message = `
        Runtime ${process.version}
    `
    common.info(message, { trim: true, spread: true, })
}

if (setup.readClientConfiguration(process.env.CLIENT_FILE)) {
    let message = ''
    message += 'Client configuration read'
    message += ` (${setup.getClientCount()} ${utils.inflectionByNumber(setup.getClientCount(), 'entry', 'entries')})`
    message += ` from ${ansi.yellowBright(process.env.CLIENT_FILE)}`
    message += ` last modified ${utils.timeString(setup.clientFileLast)}`
    common.info(message)
} else {
    common.error('Client configuration is missing')
    process.exit(1)
}

if (setup.readTaskConfiguration(process.env.TASK_FILE)) {
    let message = ''
    message += 'Task configuration read'
    message += ` (${setup.getTaskCount()} ${utils.inflectionByNumber(setup.getTaskCount(), 'entry', 'entries')})`
    message += ` from ${ansi.yellowBright(process.env.TASK_FILE)}`
    message += ` last modified ${utils.timeString(setup.taskFileLast)}`
    common.info(message)
} else {
    common.error('Task configuration is missing')
    process.exit(1)
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

const app = express()

app.use(express.json())

app.use(helmet({
	contentSecurityPolicy: false,
}))

app.use(cors())

app.use('/api/auth', route_auth)
app.use('/api/hello', route_hello)
app.use('/api/setup', route_setup)
app.use('/api/task', route_task)
app.use('/api/job', route_job)

if (utils.compareTextIgnoreCase('PROD', process.env.PROFILE)) {
	utils.removeSwaggerPath(swaggerSpec, '/api/hello')
}

app.get('/', (_, res) => res.redirect('/index.html'))

app.use(express.static('public'))

app.get(swaggerDocument, (_, res) => {
	res.setHeader('Content-Type', 'application/json')
	res.json(swaggerSpec)
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.PORT || 20002

console.log()

utils.getMethodList(listEndpoints(app)).forEach(x => console.debug(x))

app.listen(PORT)

console.debug()
console.debug('' +
	'Launcher is listening on port: ' +
  	ansi.blueBright(PORT) +
	'')
	console.debug('' +
	'Browse API documentation at: ' +
	ansi.magentaBright(`http://localhost:${PORT}/api-docs/`) +
	' ❤️' +
  	'')

// Graceful shutdown function
const gracefulShutdown = () => {
    // Perform cleanup operations or any necessary tasks before shutting down
    console.log('Received SIGTERM signal. Shutting down gracefully...');
    
    // Perform cleanup or other tasks
    
    // Close server, database connections, etc.
    
    // Exit the process gracefully
    process.exit(0)
}
  
// Listen for the SIGTERM signal
process.on('SIGTERM', gracefulShutdown)
