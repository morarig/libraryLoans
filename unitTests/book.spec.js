const Books = require('../modules/book.js')

describe('updateCount()', () => {

	test( 'the ISBN is invalid', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.updateCount('abc', 1))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('the returned flag is invalid', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.updateCount(1, 2))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('updated count for a book', async done => {
		expect.assertions(1)
		const book = await new Books()
		await book.createBook('abc', 'abc', 1, 3)
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
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('empty title of the book', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('', 'abc', 1, 1))
			.rejects.toEqual( Error('invalid input'))
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
			.rejects.toEqual( Error('invalid input'))
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
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('invalid count number', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('abc', 'abc', 1, 'abc'))
			.rejects.toEqual( Error('invalid input'))
		done()
	})

	test('empty count number', async done => {
		expect.assertions(1)
		const book = await new Books()
		await expect(book.createBook('abc', 'abc', 1, undefined))
			.rejects.toEqual( Error('invalid input'))
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
			.rejects.toEqual( Error('invalid input'))
		done()
	})
})

describe('checkCount()', () => {

	test( 'check if book is available', async done => {
		expect.assertions(2)
		const book = await new Books()
		await book.createBook('abc', 'abc', 1, 0)
		let counted = await book.checkCount(1, 1)
		expect(counted).toBe(0)
		await book.createBook('abc', 'abc', 2, 1)
		counted = await book.checkCount(2)
		expect(counted).toBe(1)
		done()
	})
})