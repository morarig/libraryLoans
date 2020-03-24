
// https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md

function sleep(ms) { //Helper function to slightly delay shell command
	return new Promise(resolve => {
		setTimeout(resolve,ms)
	})
}

const { Before, BeforeAll, After, AfterAll, Given, When, Then } = require('cucumber')
const shell = require('child_process')
// const assert = require('assert')

const Page = require('./page.js')

let page // this is the page object we use to reference a web page

BeforeAll( async() => {
	console.log('BEFORE ALL')
	shell.exec('node index.js')
	await sleep(100)
})

AfterAll( async() => {
	console.log('AFTER ALL')
	page.close()
	await shell.exec('pkill node')
	return Promise.resolve()
})

Before( async() => {
	console.log('BEFORE')
	await shell.exec('rm -rf *.db')
})

After( async() => {
	console.log('AFTER')
})

Given('The browser is open on the home page', async() => {
	console.log('The browser is open on the home page')
	page = await new Page(800, 600)
})

When('I click on the {string} link', async link => {
	console.log(`I click on the "${link}" link`)
})

When('I enter {string} in the {string} field', async(value, field) => {
	console.log(`I enter "${value}" in the "${field}" field`)
	// await page.click(`#${field}`) //field represents the id attribute in html
	// await page.keyboard.type(value)
})

When('I click on the submit button', async() => {
	console.log('I click on the submit button')
	// await page.click('#submit')
})

Then('the heading should be {string}', async heading => {
	console.log(`the heading should be "${heading}"`)
	// const text = await page.evaluate( () => {
	// 	const dom = document.querySelector('h1')
	// 	return dom.innerText
	// })
	// assert.equal(heading, text)
})

When('I enter the email link in the browser', async() => {
	console.log('I enter the email link in the browser')
})

When('I access the homepage', async() => {
	console.log('I access the homepage')
})

Then('take a screenshot called {string}', async filename => {
	await page.screenshot({ path: `screenshots/${filename}.png` })
})

// Then('the list should contain {string} rows', async rowCount => {
// 	rowCount = Number(rowCount)
// 	const items = await page.evaluate( () => {
// 		const dom = document.querySelectorAll('table tr td:first-child')
// 		const arr = Array.from(dom)
// 		return arr.map(td => td.innerText)
// 	})
// 	assert.equal(items.length, rowCount)
// })

// Then('the item should be {string}', async item => {
// 	const items = await page.evaluate( () => {
// 		const dom = document.querySelectorAll('table tr td:first-child')
// 		const arr = Array.from(dom)
// 		return arr.map(td => td.innerText)
// 	})
// 	assert.equal(item, items[0])
// })

// Then('the list should contain a single entry for {string}', async item => {
// 	const items = await page.evaluate( () => {
// 		const dom = document.querySelectorAll('table tr td:first-child')
// 		const arr = Array.from(dom).map(td => td.innerText)
// 		return arr
// 	})
// 	const count = items.reduce( (acc, val) =>  (val === item ? acc += 1 : acc), 0)
// 	assert.equal(count, 1)
// })

// Then('the {string} quantity should be {string}', async(item, qty) => {
// 	const items = await page.evaluate( () => {
// 		const dom = document.querySelectorAll('table tr')
// 		// const arr = Array.from(dom)
// 		return dom
// 	})
// 	assert.equal(2, 2)
// })
