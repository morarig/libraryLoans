const Books = require('../modules/book.js')

describe('updateCount()', () => {

	test( 'the ISBN is invalid', async done => {
		expect.assertions(1)
		const book = await new Books()
		await book.createLoan(1, 1)
		await expect(book.updateCount('abc', 1))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('the returned flag is invalid', async done => {
		expect.assertions(1)
		const book = await new Books()
		await book.createLoan(1, 1)
		await expect(book.updateCount(1, 2))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('updated count for a book', async done => {
		expect.assertions(1)
		const book = await new Books()
		await book.createLoan(1, 1)
		const updated = await book.updateCount(1, 1)
		expect(updated).toBe(true)
		done()
	})
})

describe('createBook', () => {

	test('invalid title of the book', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook(1, 'abc', 1, 1))
			.rejects.toEqual( Error('title type is invalid'))
		done()
	})

	test('empty title of the book', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('', 'abc', 1, 1))
			.rejects.toEqual( Error('empty title string'))
		done()
	})

	test('invalid picture of the book', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('abc', 1, 1, 1))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('empty picture of the book', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('abc', '', 1, 1))
			.rejects.toEqual( Error('empty picture string'))
		done()
	})

	test('invalid ISBN of the book', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('abc', 'abc', 'abc', 1))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('empty ISBN of the book', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('abc', 'abc', undefined, 1))
			.rejects.toEqual( Error(' empty ISBN input'))
		done()
	})

	test('invalid count number', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('abc', 'abc', 1, 'abc'))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('count of a book is zero', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('abc', 'abc', 1, 0))
			.rejects.toEqual( Error('count must be minimum 1'))
		done()
	})

	test('empty count number', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('abc', 'abc', 1, undefined))
			.rejects.toEqual( Error('empty count input'))
		done()
	})
})

describe('getBooks()', () => {

	test('get all books', async done => {
		expect.assertions(1)
		const book = await new Books()
		const returned = await book.getBooks()
		expect(typeof returned).toBe(typeof new Array())
		done()
	})
})

describe('remove', () => {

	test('remove a book', async done => {
		expect.assertions(1)
		const book = await new Books()
		const removed = await book.remove(1)
		expect(removed).toBe(true)
		done()
	})

	test('remove a book with invalid ISBN', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.remove('abc'))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('empty ISBN to remove a book', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.remove(''))
			.rejects.toEqual( Error('empty ISBN input'))
		done()
	})
})
