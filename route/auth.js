const router = require('express').Router()
const controller = require('../controller/auth')
const global = require('../include/global')

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authentication
 *     description: |
 *       Authenticate connection with client id and client secret.
 *       <br><br>
 *       Returns access token that should be used in all other requests.
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: string
 *                 description: Client ID
 *                 example: DEFAULT
 *               client_secret:
 *                 type: string
 *                 description: Client Secret
 *                 example: 38b45ad6c5a84398bf5c7087eda23e8f
 *           example: |
 *             {
 *               "client_id": "DEFAULT",
 *               "client_secret": "38b45ad6c5a84398bf5c7087eda23e8f"
 *             }
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                   example: XXX
 *       401:
 *         description: Authorization error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error description
 *                   example: Bad credentials
 *       404:
 *         description: Not Found
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body>Error: Not Found</body></html>"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body>Internal Server Error</body></html>"
 */
router.post('/login', (req, res) => {
	const result = controller.login(req.body)
	res.status(result.code).json(result.body)
})

/**
 * @swagger
 * /api/auth/check:
 *   get:
 *     summary: Validate token
 *     description: |
 *       Validate access token
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: Token validated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Validation error
 *                   example: Bad access token
 *       401:
 *         description: Token error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error reason
 *                   example: No token provided
 *       404:
 *         description: Not Found
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body>Error: Not Found</body></html>"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body>Internal Server Error</body></html>"
 */
router.get('/check', (req, res) => {
	if (global.production) {
		const html = '<html><body>Internal Server Error</body></html>'
		res.set('Content-Type', 'text/html')
		res.status(500).send(html)
	} else {
		const result = controller.check(req)
		res.status(result.code).json(result.body)
	}
})

module.exports = router
