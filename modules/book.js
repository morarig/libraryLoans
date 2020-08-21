/* eslint-disable complexity */
/* eslint-disable space-before-blocks */
const sqlite = require('sqlite-async')

module.exports = class Book {
    constructor(dbName = ':memory:'){
        return (async() => {
            this.db = await sqlite.open(dbName)
            const sql = 'CREATE TABLE IF NOT EXISTS books\
            (isbn INTEGER PRIMARY KEY, title TEXT, picture TEXT, count INTEGER);'
            await this.db.run(sql)
            return this
        })()
    }

    async checkCount(isbn) {
        if(isNaN(isbn) || isbn === undefined) throw new Error('invalid input')
        const sql = `SELECT count FROM books WHERE isbn = ${isbn}`
        const data = await this.db.get(sql)
        return data.count
    }

    async updateCount(isbn, flag) {
        Array.from(arguments).forEach(e => {
            if(isNaN(e) || e === undefined) throw new Error('invalid input')
        })
        if(flag !== 1 && flag !== 0) throw new Error('invalid input')
        let sql = `SELECT count from books where isbn = ${isbn}`
        let data = await this.db.get(sql)
        let count
        if (flag === 1) {count = parseInt(data.count) + 1}
        else {count = parseInt(data.count) - 1}
        sql = `UPDATE books SET count = ${count} where isbn = ${isbn}`
        await this.db.run(sql)
        return true
    }

    async createBook(title, picture, isbn, count) {
        Array.from(arguments).forEach((e, i) => {
            if (e === undefined) throw new Error('invalid input')
            if(i<2 && (typeof e !== 'string' || e ==='')) throw new Error('invalid input')
            else if(i>1 && isNaN(e)) throw new Error('invalid input')
        })
        let sql = `SELECT count(isbn) as records FROM books WHERE isbn = ${isbn}`
        const data = await this.db.get(sql)
        if(data.records > 0) throw new Error('book already exists')
        sql = `INSERT INTO books(title, picture, isbn, count) VALUES('${title}', '${picture}', ${isbn}, ${count})`
        await this.db.run(sql)
        return true
    }

    async remove(isbn) {
        if (isNaN(isbn) || isbn === undefined || isbn === '') throw new Error('invalid input')
        let sql = `SELECT count(isbn) as records FROM books WHERE isbn = ${isbn}`
        const data = await this.db.get(sql)
        if(data.records > 0) throw new Error('book already exists')
        sql = `DELETE FROM books WHERE isbn = ${isbn}`
        await this.db.run(sql)
        return true
    }

    async getBooks() {
        let sql = `SELECT count(isbn) as records FROM books`
        let data = await this.db.get(sql)
        if (data.records === 0) return []
        sql = `SELECT * FROM books`
        data = await this.db.all(sql)
        return data 
    }    
}