Overview
========

Style.js is a tiny JavaScript utility that lets you write CSS in a JS object
notation closely resembling actual CSS syntax.


Features
========

 - Tiny! Only 870 bytes minified.
 - Allows for templating your CSS
 - Your CSS can be compiled into your JS project, eliminating the need for the
   client to download extra CSS files, thus improving page load performance.


Example
=======

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


Options
=======

The `style.add()` method takes an optional second parameter: `options`.
Currently, two options are supported

### options.key
If present, this is used to uniquely identify a chunk of CSS to prevent it from
being added to document more than once.

### options.prefix
If present, this prefix is added to all CSS class names for this call.
