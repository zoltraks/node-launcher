const router = require('express').Router()
const controller = require('../controller/hello')

/**
 * @openapi
 * /api/hello/world:
 *   get:
 *     summary: Get a simple greeting
 *     description: |
 *       Say: "Hello, World."
 *     tags:
 *       - hello
 *     responses:
 *       200:
 *         description: Operation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hello:
 *                   type: string
 *                   description: Hello message
 *                   example: Hello, World.
 *                 time:
 *                   type: string
 *                   description: Time for timing purposes
 *                   example: 2020-01-01 00:00:00.000
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body>Internal Server Error</body></html>"
 */
router.get("/world", (req, res) => {
	const result = controller.world()
	res.status(result.code).json(result.body)
})

/**
 * @swagger
 * /api/hello/exception:
 *   get:
 *     summary:
 *     description: |
 *       Throw an exception.
 *     tags:
 *       - hello
 *     responses:
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body>Internal Server Error</body></html>"
 */
router.get("/exception", (req, res) => {
	const result = controller.exception()
	res.status(result.code).json(result.body)
})

module.exports = router
