Overview
========

style.js is a tiny JavaScript utility that lets you write CSS in a JS object
notation closely resembling actual CSS syntax.

[Unit tests.](http://zynga.github.io/style/test.html)


Features
========

 - Tiny! (1kB minified)
 - Allows for templating your CSS (for instance, easily add a custom prefix to
   all class names).
 - Supports .noConflict().
 - Your CSS can be compiled into your JS project, eliminating the need for the
   client to download extra CSS files, thus improving page load performance.


Examples
========

Usage is pretty simple.

```javascript
	style({
		body: {
			background: '#acf',
			color: 'green'
		},
		'.myclass, .yourclass': {
			border: '1px dotted #888'
		}
	});
```

The above code results in this being added to the document.head:

```html
	<style class="text/css">
		body {
			background: #acf;
			color: green;
		}
		.myclass, .yourclass {
			border: 1px dotted #888;
		}
	</style>
```

The object notation used above is the most similar in form to actual CSS;
however, it precludes the ability to specify multiple rules with the same
selector, or within a particular rule, multiple properties of the same name.
For the rare situations where this might be desired, you can use the alternative
array notation:

```javascript
	style([
		['body', { background: '#acf' }],
		['body', { color: 'green' }]
	]);
```

Or, more usefully:

```javascript
	style({
		'.bluebutton': [
			['background-image',
				'-moz-linear-gradient(center top, #a8ccf8 0%, #76b1f8 7%, #6eadf5 33%, #2376f5 100%)'],
			['background-image',
				'-webkit-gradient(linear, 0 0, 0 100%, from(#a8ccf8), color-stop(7%, #76b1f8), color-stop(33%, #6eadf5), to(#2376f5))']
		]
	});
```

To avoid CSS conflicts with other components on the page, it's also useful to be
able to prefix the classnames with a custom string:

```javascript
	style(
		{
			'body .fancyclass': {
				color: 'chartreuse'
			}
		},
		{ prefix: 'my_' }
	);
```

Resulting CSS:

```html
	<style class="text/css">
		body .my_fancyclass {
			color: chartreuse;
		}
	</style>
```


Options
=======

The `style()` function takes an optional second parameter: `options`.
Currently, two options are supported:

### options.key
If present, this is used to uniquely identify a chunk of CSS to prevent it from
being added to document more than once.

### options.prefix
If present, this prefix is added to all CSS class names for this call.
