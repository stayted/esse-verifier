# ESSE VERIFIER

> Esse Notarizer System

## Install

### Stand Alone

```
git clone https://github.com/stayted/esse-verifier
cd esse-verifier
node check.js <url>
```

### For use in script

Add to your package.json dependencies:

`"esse-verifier": "git+https://github.com/stayted/esse-verifier.git"`

`npm install`

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

