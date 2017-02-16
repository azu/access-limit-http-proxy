# access-limit-http-proxy

HTTP Proxy that add access limit to any URL.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install access-limit-http-proxy

## Usage

```js
"use strict";
const httpProxy = require("access-limit-http-proxy");
const targets = {
    "http://example.com": {
        // condition allow to access or return 500
        predicate(count){
            return count >= 3;
        }
    }
};
// start proxy
httpProxy(targets, {
    port: 8989
});
```

Use as Proxy

> Use as Proxy like this: http://localhost:8989/http://example.com

## Changelog

See [Releases page](https://github.com/azu/access-limit-http-proxy/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/access-limit-http-proxy/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
