////////////////////////////////////////

const rsa  = require('node-rsa');
const hash = require('hash.js')

const logger  = require('./logger');

class transaction {

    constructor( payload ) {
        this.payload         = payload;
        this.excluded_fields = [ '_id', 'txid', 'signature' ];
        this.logger          = new logger();
    }

    // public methods /////////////////////////////

    validate() {
        try {
            var manager = new rsa();
            manager.importKey( this.public_key );
            var check = manager.verify( this.original_string, this.signature, 'utf8', 'base64' );
        } catch ( error ) {
            this.logger.p('verify transaction signature', false, error);
            throw `error verifying transaction signature: ${ error }`;
        }
        if ( check === true ) {
            this.logger.p('verify transaction signature');
        } else if ( check === false ) {
            this.logger.p('verify transaction signature', false);
        }
    }

    // private methods ////////////////////////////

    // getters & setters //////////////////////////

    get signature() {
        return this.payload['signature'];
    }

    get id() {
        return this.payload['txid'];
    }

    get public_key() {
        return this.payload.pubKey;
    }

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
                // if the attribute is a string and it's a date we have to add double quotes
                // becouse javascript add double quotes when date obj is stringified
                var match = this.payload[ keys[ i ] ].match( /^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,3}.{1,5}$/ );
                if ( match ) { string += `"${ this.payload[ keys[ i ] ] }"`; continue }
            }
            string += typeof this.payload[ keys[ i ] ] === 'object' ? JSON.stringify( this.payload[ keys[ i ] ] ) : this.payload[ keys[ i ] ];
        }
        return hash.sha256().update( string ).digest('hex');
    }

}

module.exports = transaction;

