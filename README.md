OVERVIEW
--------

Style.js is a tiny JavaScript utility that lets you write CSS in a JS object
notation closely resembling actual CSS syntax.

Also included is css2js.js, a command-line utility for converting CSS files into
style.add() notation.


FEATURES (of style.js)
----------------------

 - Tiny! Only 804 bytes minified.
 - Allows for templating your CSS
 - Your CSS can be compiled into your JS project, eliminating the need for the
   client to download extra CSS files, thus improving page load performance.


EXAMPLE
-------

	style.add({
		'body': {
			'background': '#acf',
			'color': 'green'
		},
		'.myclass, .yourclass': {
			'border': '1px dotted #888'
		}
	});

Results in this being added to the document.head:

	<style class="text/css">
		body {
			background: #acf;
			color: green;
		}
		.myclass, .yourclass {
			border: 1px dotted #888;
		}
	</style>


USAGE of css2js.js
------------------

	npm install cssom-papandreou
	node css2js.js my.css > mystyle.js
