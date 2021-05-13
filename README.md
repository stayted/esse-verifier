# ESSE VERIFIER

> Esse Notarizer System

## Install

### Standalone

```
git clone https://github.com/stayted/esse-verifier
cd esse-verifier
npm install
node check.js <url_from_qrcode>
```

### In your script

Add it to your package.json dependencies:

```
  "dependencies": {
    "esse-verifier": "git+https://github.com/stayted/esse-verifier.git",
    [...]
  },
```

Install it:

`npm install esse-verifier`

Example:

```

const validator = require('esse-verifier');
  
const url = '<url_from_qrcode>';
  
( async () => {
    var obj = new validator( url );
    try {
        var response = await obj.check();
    } catch ( error ) {
        console.log( error );
    }
    console.log( 'response:', obj.response );
    console.log( 'errors:', obj.errors );
})()

```

## Correct output (standalone usage)

```
 ESSE-VERIFIER (v0.1.3)
 ######################

 - validate url                 : OK
 - download web page            : OK
 - extract node url             : OK
 - download item                : OK
 - download transaction         : OK
 - verify item signature        : OK
 - verify transaction signature : OK
 - download block               : OK
 - verify merkle tree           : OK
 - verify block status          : OK
 - download btc page            : OK
 - search for btc merkle root   : OK
 - verify btc merkle root       : OK
 - verify chainpoint receipt    : OK
 - verify transaction receipt   : OK

 RESPONSE:  OK

```

