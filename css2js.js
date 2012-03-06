/*global process, require*/
var
	inFile = (function () {
		var argv = process.argv;
		if (argv.length !== 3) {
			console.log('Usage:');
			console.log(' node css2js.js <cssFile>');
			process.exit(1);
		}
		return argv[2];
	}()),
	css = require('fs').readFileSync(inFile, 'utf-8'),
	converter = require('./cssConverter')
;
console.log(converter.convert(css));
