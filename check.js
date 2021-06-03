////////////////////////////////////////

const data      = require('./package.json');
const validator = require('./classes/validator');

console.log();
console.log(` ESSE-VERIFIER (v${data.version})`);
console.log(' ######################');
console.log();

if ( process.argv.length === 3 ) {
    var item_url = process.argv[ 2 ];
} else {
    console.log(' Error. Missing parameter.');
    console.log(' usage: check.js <item_url>\n');
    process.exit();
}

( async () => {

    var obj = new validator( item_url, true );
    try {
        var response = await obj.check();
    } catch ( error ) {
        console.log('\n ###');
        console.log(`  Error: ${ error }`);
        console.log(' ###');
    }
    console.log('');
    console.log(' RESPONSE:', response ? 'OK' : 'ERROR');
    console.log('');
//  if ( obj.errors.length > 0 ) {
//      console.log(`${ obj.errors.length } errors found.`);
//      console.log( obj.errors );
//      console.log('');
//  }

})();

