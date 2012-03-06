/*global document, module*/
(function () {

	// Establish the root object
	var
		root = this, // 'window' or 'global'
		style = { VERSION: '0.0.3' },
		previous = root.style
	;
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = style;
	}
	root.style = style;

	style.noConflict = function () {
		root.style = previous;
		return this;
	};

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
