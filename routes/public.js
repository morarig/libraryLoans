
const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})

const router = new Router()

const User = require('../modules/user')
const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	try {
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	const user = await new User(dbName)
	try {
		// call the functions in the module
		await user.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		const day = 86400, milliseconds = 1000
		const expiry = Math.floor(Date.now() / milliseconds) + day
		const token = await user.generateToken(ctx.request.body.user, expiry)
		const html = `<h2>Paste this url into your browser</h2>\
			<p>${ctx.hbs.host}/validate/${ctx.request.body.user}/${token}</p>`
		await user.sendEmail(ctx.request.body.email, 'Validate Your Account', html)
		ctx.redirect(`/postregister?msg=new user "${ctx.request.body.user}" added`)
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		user.tearDown()
	}
})

router.get('/postregister', async ctx => await ctx.render('validate'))

router.get('/validate/:user/:token', async ctx => {
	try {
		console.log('VALIDATE')
		console.log(`URL --> ${ctx.request.url}`)
		if(!ctx.request.url.includes('.css')) {
			console.log(ctx.params)
			const milliseconds = 1000
			const now = Math.floor(Date.now() / milliseconds)
			const user = await new User(dbName)
			await user.checkToken(ctx.params.user, ctx.params.token, now)
			ctx.hbs.msg = `account "${ctx.params.user}" has been validated`
			await ctx.render('login', ctx.hbs)
		}
	} catch(err) {
		await ctx.render('login', ctx.hbs)
	}
})

router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

router.post('/login', koaBody, async ctx => {
	const user = await new User(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		await user.login(body.user, body.pass)
		ctx.session.authorised = true
		const referrer = body.referrer || '/secure'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch(err) {
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		user.tearDown()
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})

module.exports = router
