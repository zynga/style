/*global global, module, require*/
(function () {

	// Make a module
	var cssConverter = (function (name) {
		var root = typeof window !== 'undefined' ? window : global,
			had = Object.prototype.hasOwnProperty.call(root, name),
			prev = root[name], me = root[name] = {};
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = me;
		}
		me.noConflict = function () {
			root[name] = had ? prev : undefined;
			if (!had) {
				try {
					delete root[name];
				} catch (ex) {
				}
			}
			return this;
		};
		return me;
	}('cssConverter'));

	cssConverter.VERSION = '0.0.6';

	var parser = require('cssom-papandreou');

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

		function iterateOverProperties(props) {
			var
				i = -1,
				len = props.length,
				prop,
				value,
				ruleBody = {},
				ruleBodies = [ruleBody]
			;
			while (++i < len) {
				prop = props[i];
				value = props[prop];
				if (prop && value) {
					if (ruleBody.hasOwnProperty(prop)) {
						// In CSS it is valid to specifiy the same property name more
						// than once, but this won't fly in JS object notation; so, we
						// need to start a new rule body.
						ruleBody = {};
						ruleBodies.push(ruleBody);
					}
					ruleBody[prop] = value;
				}
			}
			return ruleBodies;
		}

		function iterateOverParsedRules(parsedRules) {
			var
				i = -1,
				len = parsedRules.length,
				parsedRule,
				selector,
				ruleBodies
			;
			while (++i < len) {
				parsedRule = parsedRules[i];
				selector = parsedRule.selectorText;
				if (selector) {
					if (outRules.hasOwnProperty(selector)) {
						// We already have a rule with the same selector. Output the
						// current 'style.add({...})' declaration and start a new one.
						outputRules();
					}
					ruleBodies = iterateOverProperties(parsedRule.style || []);
					outRules[selector] = ruleBodies.shift();
					while (ruleBodies.length) {
						outputRules();
						outRules[selector] = ruleBodies.shift();
					}
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
