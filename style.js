/*global global, module*/
(function () {

	// Make a module
	var style = (function (name) {
		var rt = typeof window !== 'undefined' ? window : global,
			had = rt.hasOwnProperty(name), prev = rt[name], me = rt[name] = {};
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = me;
		}
		me.noConflict = function () {
			delete rt[name];
			if (had) {
				rt[name] = prev;
			}
			return this;
		};
		return me;
	}('style'));

	style.VERSION = '0.0.4';

	style.sheet = function () {
		var el;
		return {
			add: function (css) {
				if (!el) {
					el = document.createElement('style');
					el.type = 'text/css';
					document.getElementsByTagName('head')[0].appendChild(el);
				}
				if (typeof css === 'object') {
					var lines = [], selector, rule, property;
					for (selector in css) {
						if (css.hasOwnProperty(selector)) {
							lines.push(selector + ' {');
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
