
const mailer = require('nodemailer-promise')
const config = require('./config.json')

async function main() {
	try {
		const sendEmail = mailer.config(config)
		const message = {
			from: 'sender@email.com', // sender address
			to: 'marktyers@gmail.com', // list of receivers
			subject: 'Subject of your email', // Subject line
			html: '<p><a href="google.com">Your html here</a></p>'// plain text body
		}
		await sendEmail(message)
	} catch (err) {
		console.log(`error: ${err.message}`)
	}
}

main()
