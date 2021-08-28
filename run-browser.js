var http = require('http'),
    fs = require('fs'),
    path = require('path');
    url = require('url')

function serveFile(filePath, res) {
    var filePath = path.join(__dirname, filePath);
    const file = fs.readFileSync(filePath);
    res.end(file);
}

http.createServer(function(req, res, next) {
    const { pathname } = url.parse(req.url)
    switch(pathname) {
        case '/':
            serveFile('index.html', res);
            break;
        case '/gol.js':
            serveFile('lib/gol.js', res);
            break;
        default:
            res.statusCode = 404
            res.end(`{"error": "${http.STATUS_CODES[res.statusCode]}"}`) 
            break;
    }
}).listen(3000);