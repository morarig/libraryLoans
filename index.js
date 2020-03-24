
const Koa = require('koa')
const session = require('koa-session')
const staticDir = require('koa-static')
const views = require('koa-views')

const apiRouter = require('./routes/routes')

const app = new Koa()
app.keys = ['darkSecret']

const defaultPort = 8080
const port = process.env.PORT || defaultPort

app.use(staticDir('public'))
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

app.use( async(ctx, next) => {
	console.log(`${ctx.method} ${ctx.path}`)
	ctx.hbs = {
		authorised: ctx.session.authorised,
		host: `${ctx.protocol}://${ctx.host}`
	}
	for(const key in ctx.query) ctx.hbs[key] = ctx.query[key]
	await next()
})

app.use(apiRouter.routes(), apiRouter.allowedMethods())

module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
