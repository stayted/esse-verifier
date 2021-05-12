////////////////////////////////////////

const data = require('./package.json');
const validator = require('./classes/validator');

console.log(`
ESSE-VERIFIER (v${data.version})
######################
`);

if ( process.argv.length === 3 ) {
    var item_url = process.argv[ 2 ];
} else {
    var error = `
Error. Missing parameter.
usage: check.js <item_url>
    `;
    console.log( error );
    process.exit();
}

( async () => {

    var obj = new validator( item_url );
    try {
        await obj.init();
    } catch ( error ) {
        console.log(`
###
  Error: ${ error }
###
        `);
    }

    console.log('');

})();

