
const crypto = require('crypto')
const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')
const mailer = require('nodemailer-promise')

// you will need to create this file with your email details
const config = require('../config.json')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, email TEXT,\
					token TEXT, timestamp INTEGER, validated INTEGER DEFAULT 0);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * registers a new user
	 * @param {String} user the chosen username
	 * @param {String} pass the chosen password
	 * @returns {Boolean} returns true if the new user has been added
	 */
	async register(user, pass, email) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
		const data = await this.db.get(sql)
		if(data.records !== 0) throw new Error(`username "${user}" already in use`)
		sql = `SELECT COUNT(id) as records FROM users WHERE email="${email}";`
		const emails = await this.db.get(sql)
		if(emails.records !== 0) throw new Error(`email address "${email}" is already in use`)
		pass = await bcrypt.hash(pass, saltRounds)
		sql = `INSERT INTO users(user, pass, email) VALUES("${user}", "${pass}", "${email}")`
		await this.db.run(sql)
		return true
	}

	/**
	 * send an email message
	 * @param {String} to the email address to send the email to
	 * @param {String} subject the subject line of the email
	 * @param {String} html the html-formatted body of the email
	 * @returns {Boolean} returns true if the email was sent
	 */
	async sendEmail(to, subject, html) {
		try {
			const sendEmail = mailer.config(config)
			const from = 'noreply@email.com'
			const message = { from, to, subject, html }
			await sendEmail(message)
			return true
		} catch (err) {
			throw new Error('not able to send email')
		}
	}

	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} username the username to check
	 * @param {String} password the password to check
	 * @returns {Boolean} returns true if credentials are valid
	 */
	async login(username, password) {
		let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)
		sql = `SELECT pass, validated FROM users WHERE user = "${username}";`
		const record = await this.db.get(sql)
		if(!record.validated) throw new Error('this account has not been validated')
		const valid = await bcrypt.compare(password, record.pass)
		if(valid === false) throw new Error(`invalid password for account "${username}"`)
		return true
	}

	/**
	 * generates and stores a token for the specified user
	 * the token will only be valid up to the timestamp specified in expiry
	 * @param {String} username generates a valid token for the user
	 * @param {Number} expiry a timestamp indicating when the token expires
	 * @returns {String} the token
	 */
	async generateToken(username, expiry) {
		const len = 16
		const token = crypto.randomBytes(len).toString('hex')
		const sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)
		const encToken = await bcrypt.hash(token, saltRounds)
		const updateSQL = `UPDATE users SET token = "${encToken}",\
			timestamp = ${expiry} WHERE user="${username}"`
		await this.db.run(updateSQL)
		return token
	}

	/**
	 * checks the supplied token is valid and deletes it from the database
	 * @param {String} username the username of the specified user
	 * @param {String} token the token to check against the database
	 * @param {Number} now the current UNIX timestamp
	 * @returns {Boolean} returns true if the token was valid
	 */
	async checkToken(username, token, now) {
		const sql = `SELECT id, token, timestamp, validated FROM users WHERE user="${username}"`
		const user = await this.db.get(sql)
		if(user.validated) return true // the user has already validated their account
		if(user.token === null) throw new Error(`no token found for user "${username}"`)
		if(user.timestamp < now) throw new Error('token has expired')
		const updateSQL = `UPDATE users SET token = null, timestamp = null, validated = 1 WHERE user="${username}"`
		await this.db.run(updateSQL)
		return true
	}

	/**
	 * checks the status of an account (exists/validated)
	 * @param {String} username the username to check
	 * @returns {Boolean} returns true if the account exists and is validated
	 */
	async checkStatus(username) {
		const user = await this.db.get(`SELECT validated FROM users WHERE user="${username}"`)
		if(user === undefined) throw new Error(`the "${username}" account does not exist`)
		if(user.validated === 0) throw new Error(`the "${username}" account has not been validated`)
		return true
	}

	/**
	 * sets the status of the account to 'validated'
	 * @param {String} username the username of the specified user
	 * @returns {Boolean} returns true if account has been validated
	 */
	async validateAccount(username) {
		const sql = `UPDATE users SET validated = 1 WHERE user = "${username}"`
		await this.db.run(sql)
		return true
	}

	async tearDown() {
		await this.db.close()
	}
}
