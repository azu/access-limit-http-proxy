const debug = require("debug")("access-limit-http-proxy");
const Thin = require('thin');
const assert = require('assert');
const proxy = new Thin();
const countMap = new Map();
/**
 * @typedef {Object} TargetInterface
 * @type {{predicate: ((count))}}
 */
const TargetInterface = {
    predicate(count){
        return true
    }
};

module.exports = function(targets, options = {}) {
    const port = options.port || 8989;
    const intercept = function(req, res, next) {
        const requestURL = req.url.slice(1);
        if (!targets[requestURL]) {
            return void next();
        }
        const predicate = targets[requestURL].predicate;
        assert(typeof predicate === "function", "target should have predicate");
        const currentCount = countMap.get(requestURL) || 0;
        const count = currentCount + 1;
        debug("requestURL:", requestURL, "count:", count);
        countMap.set(requestURL, count);
        if (predicate(count)) {
            debug("redirect", requestURL);
            res.writeHead(302, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, GET',
                'Access-Control-Allow-Headers': '*',
                Location: requestURL
            });
            res.end();
        }
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('500 Internal Server Error(Fake)');
    };
    proxy.use(intercept);
    proxy.listen(port, 'localhost', function(err) {
        if (err) {
            console.error(err);
        }
    });
    console.log(`Listen http://localhost:${port}`);
    console.log(`Use as Proxy like this: http://localhost:${port}/http://example.com`);
};