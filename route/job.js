const router = require('express').Router()
const controller = require('../controller/task')
const security = require('../include/security')

/**
 * @openapi
 * /api/job/info/{job}:
 *   get:
 *     summary: Get job information
 *     tags:
 *       - job
 *     description: |
 *       Returns detailed information about current job state.
 *     parameters:
 *       - in: path
 *         name: job
 *         required: true
 *         description: Job GUID
 *         example: 85509687-0261-4166-b53d-63c0a4ee24eb
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
 *                 created:
 *                   type: string
 *                   description: Job created time
 *                   example: 2020-01-01 13:59:59.998
 *                 stopped:
 *                   type: string
 *                   description: Job stopped time
 *                   example: 2020-01-01 15:03:02.001
 *                 running:
 *                   type: string
 *                   description: Is job running
 *                   example: YES
 *                   required: false
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Job not found
 */
router.get("/info/:job/", security.middleware, (req, res) => {
	const result = controller.getJob(req.params)
	res.status(result.code).json(result.body)
})

/**
 * @openapi
 * /api/job/stdout/{job}:
 *   get:
 *     summary: Get job output stream
 *     tags:
 *       - job
 *     description: |
 *       Returns stdout.
 *     parameters:
 *       - in: path
 *         name: job
 *         required: true
 *         description: Job GUID
 *         example: 85509687-0261-4166-b53d-63c0a4ee24eb
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
 *                 stdout:
 *                   type: string
 *                   description: Job stdout
 *                   example: Console out
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Job not found
 */
router.get("/stdout/:job/", security.middleware, (req, res) => {
	const result = controller.getJobStdout(req.params)
	res.status(result.code).json(result.body)
})

/**
 * @openapi
 * /api/job/stderr/{job}:
 *   get:
 *     summary: Get job error stream
 *     tags:
 *       - job
 *     description: |
 *       Returns stderr.
 *     parameters:
 *       - in: path
 *         name: job
 *         required: true
 *         description: Job GUID
 *         example: 85509687-0261-4166-b53d-63c0a4ee24eb
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
 *                 stderr:
 *                   type: string
 *                   description: Job stderr
 *                   example: Console error
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Job not found
 */
router.get("/stderr/:job/", security.middleware, (req, res) => {
	const result = controller.getJobStderr(req.params)
	res.status(result.code).json(result.body)
})

// /**
//  * @openapi
//  * /api/job/stdin/{job}:
//  *   post:
//  *     summary: Write to job input
//  *     tags:
//  *       - job
//  *     description: |
//  *       Returns result of write operation to job stdin.
//  *     responses:
//  *       200:
//  *         description: Operation result
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 stderr:
//  *                   type: string
//  *                   description: Job stderr
//  *                   example: Console error
//  *       404:
//  *         description: Not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Error message
//  *                   example: Job not found
//  */
// router.post("/stdin/:job/", security.middleware, (req, res) => {
// 	const result = controller.postJobStdin(req.params)
// 	res.status(result.code).json(result.body)
// })

module.exports = router
