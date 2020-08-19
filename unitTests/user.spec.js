
const Accounts = require('../modules/user.js')

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('doej', 'password', 'doej@gmail.com', 0)
		expect(register).toBe(true)
		account.tearDown()
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@gmail.com')
		await expect( account.register('doej', 'password', 'doej@gmail.com', 0) )
			.rejects.toEqual( Error('username "doej" already in use') )
		account.tearDown()
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('', 'password', 'doej@gmail.com', 0) )
			.rejects.toEqual( Error('missing field') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', '', 'doej@gmail.com', 0) )
			.rejects.toEqual( Error('missing field') )
		done()
	})
	test('error if blank email', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '', 0) )
			.rejects.toEqual( Error('missing field') )
		done()
	})
	test('error if duplicate email', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('bondj', 'p455w0rd', 'doej@gmail.com', 0)
		await expect( account.register('doej', 'password', 'doej@gmail.com', 0) )
			.rejects.toEqual( Error('email address "doej@gmail.com" is already in use') )
		done()
	})

	test('check if usertype is valid', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect(account.register('bondj', 'p455w0rd', 'doej@gmail.com', 3))
			.rejects.toEqual(Error ('usertype is invalid'))
		done()
	})
})

describe('sendEmail()', () => {
	test('send email to valid user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const status = await account.sendEmail('marktyers@gmail.com', 'test', '<h1>Test</h1>')
		expect(status).toBe(true)
		done()
	})
	test('throws error if invalid email', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect(account.sendEmail('marktyers', 'test', '<h1>Test</h1>'))
			.rejects.toEqual( Error('not able to send email') )
		done()
	})
})

describe('generateToken()', () => {
	test('should generate a valid token', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const string = new String('sdasdsa')
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		const token = await account.generateToken('doej', Math.floor(Date.now() / 1000))
		expect(typeof token).toEqual('string')
		done()
	})
	test('should throw an error if invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await expect( account.generateToken('baduser', Math.floor(Date.now() / 1000)) )
			.rejects.toEqual( Error('username "baduser" not found') )
		done()
	})
})

describe('checkToken()', () => {
	test('check for a valid token', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		const token = await account.generateToken('doej', Math.floor(Date.now() / 1000) + 100)
		const valid = await account.checkToken('doej', token, Math.floor(Date.now() / 1000))
		expect(valid).toBe(true)
		done()
	})
	test('should return true if account already validated', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		const token = await account.generateToken('doej', Math.floor(Date.now() / 1000) + 100)
		await account.checkToken('doej', token, Math.floor(Date.now() / 1000)) // this will delete the token
		const valid = await account.checkToken('doej', token, Math.floor(Date.now() / 1000))
		expect(valid).toBe(true)
		done()
	})
	test('throw an error if there is no token', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await expect( account.checkToken('doej', 'xxxxxx', Math.floor(Date.now() / 1000)) )
			.rejects.toEqual(Error('no token found for user "doej"') )
		done()
	})
	test('throw an error if the token has expired', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		const token = await account.generateToken('doej', Math.floor(Date.now() / 1000) - 100)
		await expect( account.checkToken('doej', token, Math.floor(Date.now() / 1000)) )
			.rejects.toEqual(Error('token has expired') )
		done()
	})
})

describe('checkStatus()', () => {
	test('the account not validated when created', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await expect( account.checkStatus('doej') )
			.rejects.toEqual( Error('the "doej" account has not been validated') )
		done()
	})
	test('an invalid username throws an error', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await expect( account.checkStatus('baduser') )
			.rejects.toEqual( Error('the "baduser" account does not exist') )
		done()
	})
})

describe('validateAccount()', () => {
	test('validating a real account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await account.validateAccount('doej')
		const status = await account.checkStatus('doej')
		expect(status).toBe(true)
		done()
	})
})

describe('login()', () => {
	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await account.validateAccount('doej')
		const valid = await account.login('doej', 'password')
		expect(valid).toBe(true)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await expect( account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('account not validated', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('this account has not been validated') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await account.validateAccount('doej')
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})

describe('updateCharge()', () => {
	test('set the charge of a user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		const updated = await account.updateCharge(1, '0.5')
		expect(updated).toBe(true)
		done()
	})

	test ('set charge for an inexistent user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.updateCharge(1, '0.5'))
			.rejects.toEqual( Error('user does not exist'))
		done()
	})

	test ('charge is empty string', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await expect (account.updateCharge(1, ''))
			.rejects.toEqual( Error('charge is invalid'))
		done()
	})

	test ('charge is a string', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'doej@yahoo.com', 0)
		await expect (account.updateCharge(1, 'abc'))
			.rejects.toEqual( Error('charge is invalid'))
		done()
	})
})
