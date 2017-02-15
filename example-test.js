// MIT © 2017 azu
"use strict";
const httpProxy = require("./src/access-limit-http-proxy");
const targets = {
    "http://nicolive-dev.cdn.nimg.jp/live/coe/1.0.13/questionnaire.json": {
        predicate(count){
            return count >= 10;
        }
    }
};
httpProxy(targets);