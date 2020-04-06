# canary
canary for pinging websites checking web app status etc

## usage

```
// include the lib
const canary = require('webcanary');

// use the Verse object to configure a web request:
new canary.Verse(url, method = 'GET', payload = null, timeout = 5000, title = null, auth = {}, headers = [])... 

// quick check

canary.check(new canary.Verse('https://www.google.com/'), (err, verse) => {
    console.log(err);
    console.log(verse);
});

// configure a complex call (such as a post or put)
const cnf = {
    "title": "Example API with auth",
    "url": "https://fake.me/api",
    "auth": {
        "username": "janedoe",
        "password": "s00pers3cret"
    },
    "payload": {
        "foo": "bar"
    },
    "method": "POST",
    "timeout": 10000
};

canary.check(new canary.Verse(cnf), (err, verse) => {
    console.log(err);
    console.log(verse);
});

// check multiple websites (will run in parallel to save time)
// every new verse will add to an internal verses object, and you just need to simply do:
new canary.Verse('https://www.google.com');
new canary.Verse('https://apple.com');
...

canary.checkMultiple((e, verses) => {
    if (verses instanceof Array && verses.length > 0) {
        verses.forEach(v => {
            if (v instanceof canary.Verse) {
                // all stuff are contained in verse, dump it out to see the results
                console.log(v);
            }
        });
    }
});

```

## cli usage

### Web Canary Commandline tool

  This tool checks one or multiple websites/services to see whether they are
  online and return a valid response.

#### Typical Example

  `webcanary -u http://www.google.com http://www.apple.com -v -t 1000`

#### Options
```
  -h, --help                 Display the usage guide.
  -u, --url <url>            The URL(s) you would like to check, for more than 1 url, separate them by
                             space
                             Note: authentication is not supported with this option, please use
                             --config-file option instead
  -t, --timeout <ms>         optional Timeout value in ms, default is 5000ms
  -c, --config-file string   JSON config file, file format see example here:
                             https://github.com/coreorm/canary/blob/master/sample-config.json
  -v, --verbose              Verbose mode

  Project home: https://github.com/coreorm/canary
```
