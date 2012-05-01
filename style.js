/*global global, module*/
(function () {

	// Make a module
	var style = (function (name) {
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
	}('style'));

	style.VERSION = '0.0.7';


	var keys = {};

	style.sheet = function () {
		var el, key, prefix;
		return {
			add: function (css, options) {
				key = options && options.key;
				if (key) {
					if (keys.hasOwnProperty(key)) {
						return;
					}
					keys[key] = true;
				}
				prefix = options && options.prefix;
				if (!el) {
					el = document.createElement('style');
					el.type = 'text/css';
					document.getElementsByTagName('head')[0].appendChild(el);
				}
				if (typeof css === 'object') {
					var lines = [], rule, selector, finalSelector, property;
					for (selector in css) {
						if (css.hasOwnProperty(selector)) {
							finalSelector = prefix ?
								selector.replace(/\./g, '.' + prefix) : selector;
							lines.push(finalSelector + ' {');
							rule = css[selector];
							for (property in rule) {
								if (rule.hasOwnProperty(property)) {
									lines.push(property + ': ' + rule[property] + ';');
								}
							}
							lines.push('}');
						}
					}
					css = lines.join('\n');
				}
				if (el.styleSheet) { // IE
					el.styleSheet.cssText += css;
				} else {
					el.appendChild(document.createTextNode(css));
				}
			}
		};
	};

	var defaultSheet = style.sheet();
	style.add = defaultSheet.add;

}());
