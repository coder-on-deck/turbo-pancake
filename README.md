turbo-pancake
========

![Turbo Pancake][logo.png]

Installation
--------

    $ npm install turbo-pancake --save


Usage (with express)
--------

```javascript
// require sse
var sse = require('turbo-pancake');
var express = require('express');

var app = express();

app.get('/events', sse, function(req, res) {
	// res.sse is made available via the middleware
	res.sse('content', 'optional_id');
});
```

  [1]: https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events
