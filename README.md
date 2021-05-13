# ESSE VERIFIER

> Esse Notarizer System

## Install

### Standalone

```
git clone https://github.com/stayted/esse-verifier
cd esse-verifier
node check.js <url_from_qrcode>
```

### Use it in your script

Add to your package.json dependencies:

`"esse-verifier": "git+https://github.com/stayted/esse-verifier.git"`

Install it:

`npm install esse-verifier`

Use it in your script:

```
const validator = require('esse-verifier');
  
const url = '<url_from_qrcode>';
  
( async () => {
    var obj = new validator( url, true );
    try {
        var response = await obj.check();
    } catch ( error ) {
        console.log( error );
    }
    console.log( 'response:', obj.response );
    console.log( 'errors:', obj.errors );
})()
```

