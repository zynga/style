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
	parsedRules = (new (require('jscssp').CSSParser)()).parse(css).cssRules,
	style = require('./style'),
	outRules = {}
;

function outputRules() {
	console.log('style.add(');
	console.log(outRules);
	console.log(');');
	outRules = {};
}

function iterateOverDeclarations(declarations, outRule) {
	var
		i = -1,
		len = declarations.length,
		declaration
	;
	while (++i < len) {
		declaration = declarations[i];
		property = declaration.property;
		value = declaration.valueText;
		if (property && value) {
			outRule[property] = value;
		}
	}
}

function iterateOverParsedRules(parsedRules) {
	var
		i = -1,
		len = parsedRules.length,
		parsedRule,
		selector,
		outRule
	;
	while (++i < len) {
		parsedRule = parsedRules[i];
		selector = parsedRule.mSelectorText;
		if (selector) {
			if (outRules[selector]) {
				// We already have a rule with the same selector.
				outputRules();
			}
			outRule = outRules[selector] = {};
			iterateOverDeclarations(parsedRule.declarations || [], outRule);
		}
	}
}

iterateOverParsedRules(parsedRules);

if (outRules !== {}) {
	outputRules();
}
