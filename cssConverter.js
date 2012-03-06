/*global module, require*/
(function () {

	// Establish the root object
	var
		root = this, // 'window' or 'global'
		cssConverter = { VERSION: '0.0.1' },
		previous = root.cssConverter
	;
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = cssConverter;
	}
	root.cssConverter = cssConverter;

	cssConverter.noConflict = function () {
		root.cssConverter = previous;
		return this;
	};

	var parser = new (require('jscssp').CSSParser)();

	function isEmpty(obj) {
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				return false;
			}
		}
		return true;
	}

	cssConverter.convert = function (css) {
		var
			output = '',
			outRules = {},
			parsedRules = parser.parse(css).cssRules
		;

		function outputRules() {
			output += 'style.add(' + JSON.stringify(outRules) + ');\n';
			outRules = {};
		}

		function iterateOverDeclarations(declarations, outRule) {
			var
				i = -1,
				len = declarations.length,
				declaration,
				property,
				value
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

		if (!isEmpty(outRules)) {
			outputRules();
		}

		return output;
	};

}());
