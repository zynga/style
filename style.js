// style.js is a tiny JavaScript utility that lets you write CSS in a JS object
// notation closely resembling actual CSS syntax.
(function (win, doc, undef) {
	var
		style,
		funcName = 'style',
		VERSION = '0.2.1',
		ObjProto = Object.prototype,
		hasOwn = ObjProto.hasOwnProperty,
		had = hasOwn.call(win, funcName),
		previous = win[funcName],
		defaultEl,
		head,
		keys = {},
		isArray = Array.isArray || function (obj) {
			return ObjProto.toString.call(obj) === '[object Array]';
		}
	;

	// Create a <style> element, and add it to <head>.
	function createEl() {
		var el = doc.createElement('style');
		el.type = 'text/css';
		head = head || doc.getElementsByTagName('head')[0];
		head.appendChild(el);
		return el;
	}

	// Here is the actual style() function.
	style = win[funcName] = function (css, options, el) {
		var
			key = options && options.key,
			lines = [],
			prefix = options && options.prefix
		;
		if (!el) {
			el = defaultEl = defaultEl || createEl();
		}
		if (key) {
			if (hasOwn.call(keys, key)) {
				return;
			}
			keys[key] = true;
		}
		function addRule(selector, rule) {
			var finalSelector = prefix ?
				selector.replace(/\./g, '.' + prefix) : selector;
			lines.push(finalSelector + ' {');
			if (isArray(rule)) {
				for (var i = -1, len = rule.length; ++i < len;) {
					var line = rule[i];
					lines.push(line[0] + ': ' + line[1] + ';');
				}
			} else {
				for (var prop in rule) {
					if (hasOwn.call(rule, prop)) {
						lines.push(prop + ': ' + rule[prop] + ';');
					}
				}
			}
			lines.push('}');
		}
		if (typeof css === 'object') {
			if (isArray(css)) {
				for (var i = -1, len = css.length; ++i < len;) {
					var rule = css[i];
					addRule(rule[0], rule[1]);
				}
			} else {
				for (var selector in css) {
					if (hasOwn.call(css, selector)) {
						addRule(selector, css[selector]);
					}
				}
			}
			css = lines.join('\n');
		}
		if (el.styleSheet) { // IE
			el.styleSheet.cssText += css;
		} else {
			el.appendChild(doc.createTextNode(css));
		}
	};

	style.VERSION = VERSION;

	style.noConflict = function () {
		if (win[funcName] === style) {
			win[funcName] = had ? previous : undef;
			if (!had) {
				try {
					delete win[funcName];
				} catch (ex) {
				}
			}
		}
		return style;
	};

	// For backwards compatibility, style.add() is an alias for style().
	style.add = style;

	// Force creation of a new <style> element, returning a scoped style()
	// function that will append styles to this new element.
	style.sheet = function () {
		var
			el = createEl(),
			sheetFunc = function (css, options) {
				style(css, options, el);
			}
		;
		sheetFunc.add = sheetFunc;
		return sheetFunc;
	};

}(this, document));
