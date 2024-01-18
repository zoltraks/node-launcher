const router = require('express').Router()
const controller = require('../controller/setup')
const common = require('../include/common')
const security = require('../include/security')

/**
 * @openapi
 * /api/setup/task/{task}:
 *   get:
 *     summary: Retrieve information on task
 *     tags:
 *       - setup
 *     description: |
 *       Return task configuration.
 *     parameters:
 *       - in: path
 *         name: task
 *         required: true
 *         description: Task name
 *         example: default
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Not found
 *                 key:
 *                   type: string
 *                   description: Access key
 *                   example: f66b3695-f18b-4686-bea5-10dc4b9f47cc
 *                 configuration:
 *                   type: string
 *                   description: Configuration set for this access key
 *                   example: DEFAULT
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body>Internal Server Error</body></html>"
 */
router.get("/task/:task", security.middleware, async (req, res) => {
	const debug = process.env.DEBUG === 'true'
	if (debug) {
		common.log(req.originalUrl, 'info')
	}
	const result = await controller.getTask(req.params)
	res.status(result.code ? result.code : 200).json(result.body)
})

/**
 * @openapi
 * /api/setup/task:
 *   get:
 *     summary: Show configured tasks
 *     tags:
 *       - setup
 *     description: |
 *     responses:
 *       200:
 *         description: Operation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example:
 *                           - name: default
 *                           - name: echo
 *                           - name: bash
 *                 time:
 *                   type: string
 *                   description: Time of the response
 *                   example: 2020-01-01 00:00:00.000
 *       400:
 *         description: Operation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Task could not be started
 *                 time:
 *                   type: string
 *                   description: Time for timing purposes
 *                   example: 2020-01-01 00:00:00.000
 *                 exception:
 *                   type: string
 *                   description: Exception message
 *                   example: Internal exception details for bug hunting
 *                 job:
 *                   type: string
 *                   description: |
 *                     Job GUID
 *                     <br><br>
 *                     This field will be set to working job GUID if error was caused because task is currently running. 
 *                   example: f66b3695-f18b-4686-bea5-10dc4b9f47cc
 */
router.get("/task", security.middleware, async (_, res) => {
	const result = await controller.getTaskList()
	res.status(result.code).json(result.body)
})

module.exports = router
