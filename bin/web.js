#!/usr/bin/env node

let express = require('express');
let cors    = require('cors');
let history = require('connect-history-api-fallback');
let app     = express();

app.use(cors());
app.use(history());
app.use(express.static('dist'));

app.listen(8080, function() {
    console.log('Explorer listening on port 8080!')
});
