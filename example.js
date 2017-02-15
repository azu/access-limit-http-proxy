// MIT © 2017 azu
"use strict";
const httpProxy = require("./src/access-limit-http-proxy");
const targets = {
    "http://example.com": {
        predicate(count){
            return count >= 3;
        }
    }
};
httpProxy(targets);