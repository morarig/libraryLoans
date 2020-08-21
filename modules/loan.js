/* eslint-disable space-before-blocks */
const sqlite = require('sqlite-async')

module.exports = class Loan {

    constructor(dbName = ':memory:'){
        return (async() => {
            this.db = await sqlite.open(dbName)
            const sql = 'CREATE TABLE IF NOT EXISTS loans\
            (id INTEGER PRIMARY KEY AUTOINCREMENT, returned BOOLEAN, charge TEXT, date INTEGER,\
                bookID INTEGER REFERENCES books(isbn), studentID INTEGER REFERENCES users(id));'
            await this.db.run(sql)
            return this
        })()
    }

    async createLoan(studentID, bookID) {
        Array.from(arguments).forEach( val => {
            if(val.length === 0 || isNaN(val)) throw new Error('invalid input')
        })
        let sql = `INSERT INTO loans(studentID, bookID) VALUES("${studentID}", "${bookID}")`
		await this.db.run(sql)
		return true
    }

    async returned(studentID, bookID) {
        Array.from(arguments).forEach( val => {
            if(val.length === 0 || isNaN(val)) throw new Error('invalid input')
        })
        const sql = `UPDATE loans SET returned = true WHERE studentID = ${studentID} AND bookID = ${bookID}`
        await this.db.run(sql)
        return true
    }

    async getLoans(studentID) {
        if (isNaN(studentID) || studentID === undefined) throw new Error('invalid student id number')
        let sql = `SELECT count(id) as records FROM loans WHERE studentID = ${studentID}`
        let data = await this.db.get(sql)
        if(data.records===0) return []
        sql = `SELECT * FROM loans WHERE studentID = ${studentID}`
        data = await this.db.all(sql)
        return data
    }
}
