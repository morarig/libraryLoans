const Loans = require('../modules/loan.js')

describe('createLoan()', () => {

	test('create a loan with invalid ISBN', async done => {
		expect.assertions(1)
		const loan = await new Loans()
		await expect(loan.createLoan(1, 'abc'))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('create a loan with invalid STD', async done => {
		expect.assertions(1)
		const loan = await new Loans()
		await expect(loan.createLoan('abc', 1))
			.rejects.toEqual( Error('invalid input'))
		done()
	})
})

describe('returned()', () => {

	test('return a book with invalid ISBN', async done => {
		expect.assertions(1)
		const loan = await new Loans()
		await loan.createLoan(1, 1)
		await expect(loan.returned(1, 'abc'))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('return a book with invalid STD', async done => {
		expect.assertions(1)
		const loan = await new Loans()
		await loan.createLoan(1, 1)
		await expect(loan.returned('abc', 1))
			.rejects.toEqual( Error('invalid input'))
		done()
	})
})

describe('getLoans', () => {

	test('get all loans for invalid user', async done => {
		expect.assertions(1)
		const loan = await new Loans()
		await expect(loan.getLoans('abc'))
			.rejects.toEqual( Error('invalid student id number'))
		done()
	})

	test('get all loans for a user', async done => {
		expect.assertions(1)
		const loan = await new Loans()
		await loan.createLoan(1, 1)
		await loan.createLoan(1, 2)
		const allLoans = await loan.getLoans(1)
		expect(allLoans.length).toBe(2)
		done()
	})
})
