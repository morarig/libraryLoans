
const Router = require('koa-router')

const router = new Router({ prefix: '/secure' })

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => {
	try {
		console.log(ctx.hbs)
		if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		await ctx.render('secure', ctx.hbs)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router
