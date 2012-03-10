/*global module, require*/
(function () {

	// Establish the root object
	var
		root = this, // 'window' or 'global'
		cssConverter = { VERSION: '0.0.3' },
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

	var parser = require('CSSOM');

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
			parsed = parser.parse(css),
			parsedRules = parsed && parsed.cssRules
		;

		if (!parsedRules) {
			return output;
		}

		function outputRules() {
			output += 'style.add(' + JSON.stringify(outRules) + ');\n';
			outRules = {};
		}

		function iterateOverProperties(props, outRule) {
			var
				i = -1,
				len = props.length,
				prop,
				value
			;
			while (++i < len) {
				prop = props[i];
				value = props[prop];
				if (prop && value) {
					outRule[prop] = value;
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
				selector = parsedRule.selectorText;
				if (selector) {
					if (outRules[selector]) {
						// We already have a rule with the same selector.
						outputRules();
					}
					outRule = outRules[selector] = {};
					iterateOverProperties(parsedRule.style || [], outRule);
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
