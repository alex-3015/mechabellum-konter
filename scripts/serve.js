const http = require('http'), fs = require('fs');
const file = process.argv[2];
http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); fs.createReadStream(file).pipe(res); }).listen(4317, '127.0.0.1');
