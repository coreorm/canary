# canary
canary for pinging websites checking web app status etc

## usage

```
const canary = require('webcanary');

canary.check(new canary.Verse('https://www.google.com/'), (err, verse) => {
    console.log(err);
    console.log(verse);
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
