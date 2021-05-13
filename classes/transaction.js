////////////////////////////////////////

const rsa       = require('node-rsa');
const base64url = require('base64url');
const hash      = require('hash.js')

const logger = require('./logger');

class transaction {

    constructor( payload ) {
        this.payload = payload;
        this.excluded_fields = [ '_id', 'txid', 'signature' ];
    }

    // public methods /////////////////////////////


    validate() {
        try {
            var manager = new rsa();
            //console.log( 'signature', this.id );
            //console.log( 'string   ', this.original_string );
            manager.importKey( this.public_key );
            //var b64sign = base64url.toBase64( this.id );
            var check = manager.verify( this.original_string, this.id, 'utf8', 'base64' );
        } catch ( error ) {
            logger('verify transaction signature', false);
            throw `error verifying transaction signature: ${ error }`;
        }
        if ( check === true ) {
            logger('verify transaction signature');
        } else if ( check === false ) {
            logger('verify transaction signature', false);
        }
    }

    // private methods ////////////////////////////

    get original_string() {
        var keys = [];
        Object.keys( this.payload ).map( key => {
            if ( this.excluded_fields.includes( key ) === false ) {
                keys.push( key );
            }
        });
        keys.sort();
        var string = '';
        for ( var i = 0; i < keys.length; i++ ) {
            if ( typeof this.payload[ keys[ i ] ] === 'string' ) {
                var match = this.payload[ keys[ i ] ].match( /^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,3}.{1,3}$/ );
                if ( match ) { string += `"${ this.payload[ keys[ i ] ] }"`; continue }
            }
            string += typeof this.payload[ keys[ i ] ] === 'object' ? JSON.stringify( this.payload[ keys[ i ] ] ) : this.payload[ keys[ i ] ];
        }
        return hash.sha256().update( string ).digest('hex');
    }

    // getters & setters //////////////////////////

    get id() {
        return this.payload['signature'];
    }

    get public_key() {
        return this.payload.pubKey;
    }

}

module.exports = transaction;

