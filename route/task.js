const router = require('express').Router()
const controller = require('../controller/task')
const security = require('../include/security')

/**
 * @openapi
 * /api/task/start/{task}:
 *   get:
 *     summary: Start task
 *     tags:
 *       - task
 *     description: |
 *       Start new task if it is not running.
 *       <br><br>
 *       No job will be started if application is in maintenance mode.
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
 *         description: Operation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 time:
 *                   type: string
 *                   description: Task start time
 *                   example: 2020-01-01 00:00:00.000
 *                 job:
 *                   type: string
 *                   description: Job GUID
 *                   example: 9be394b5-a464-4068-ae75-3f528f35e058
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
router.get("/start/:task/", security.middleware, async (req, res) => {
	const result = await controller.start(req.params)
	res.status(result.code).json(result.body)
})

/**
 * @openapi
 * /api/task/info/{task}:
 *   get:
 *     summary: Show information
 *     tags:
 *       - task
 *     description: |
 *       Returns detailed information about current task state.
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
 *         description: Operation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 time:
 *                   type: string
 *                   description: Task start time
 *                   example: 2020-01-01 00:00:00.000
 *                 exception:
 *                   type: string
 *                   description: Exception message
 *                   example: Internal exception details for bug hunting
 *                 serial:
 *                   type: string
 *                   description: Task execution serial number 
 *                   example: f66b3695-f18b-4686-bea5-10dc4b9f47cc
 *       400:
 *         description: Operation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Task not registered
 */
router.get("/info/:task/", security.middleware, (req, res) => {
	const result = controller.getTaskInfo(req.params)
	res.status(result.code).json(result.body)
})

module.exports = router
