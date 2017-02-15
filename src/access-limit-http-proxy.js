const debug = require("debug")("access-limit-http-proxy");
const Thin = require('thin');
const assert = require('assert');
const proxy = new Thin();
const countMap = new Map();
const allowCountMap = new Map();
const helpers = require("./helper");
// but with few exclusions
const port = 8081;
const allowCount = 3;
const targetURL = "http://example.com/";
countMap.set(targetURL, 0);
allowCountMap.set(targetURL, allowCount);

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
            req.pipe(res);
            return
        }
        const predicate = targets[requestURL].predicate;
        assert(typeof predicate === "function", "target should have predicate");
        const currentCount = countMap.get(targetURL) || 0;
        const count = currentCount + 1;
        debug("requestURL:", requestURL, "count:", count);
        countMap.set(targetURL, count);
        if (predicate(count)) {
            debug("redirect", requestURL);
            res.writeHead(302, {
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