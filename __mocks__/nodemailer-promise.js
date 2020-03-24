
const config = function() {
	return mailOptions => new Promise( (resolve, reject) => {
		if(!mailOptions.to.includes('@')) return reject('MOCK ERROR: INVALID EMAIL')
		resolve()
	})
}

module.exports.config = config
