////////////////////////////////////////

const rsa       = require('node-rsa');
const base64url = require('base64url');

const logger = require('./logger');

class item {

    constructor( payload ) {
        this.payload         = payload;
        this.excluded_fields = ['_id', '@id', '@updates', '@updated', '@update-description' ];
        this.logger          = new logger();
    }

    // public methods /////////////////////////////

    validate( public_key ) {
        try {
            var manager = new rsa();
            manager.importKey( public_key );
            var b64sign = base64url.toBase64( this.id );
            var check = manager.verify( this.original_string, b64sign, 'utf8', 'base64' );
        } catch ( error ) {
            this.logger.p('verify item signature', false, error);
            throw `error verifying item signature: ${ error }`;
        }
        if ( check === true ) {
            this.logger.p('verify item signature');
        } else if ( check === false ) {
            this.logger.p('verify item signature', false);
        }
    }

    // private methods ////////////////////////////

    // getters & setters //////////////////////////

    get id() {
        return this.payload['@id'];
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
            string += typeof this.payload[ keys[ i ] ] === 'object' ? JSON.stringify( this.payload[ keys[ i ] ] ) : this.payload[ keys[ i ] ];
        }
        return string;
    }

}

module.exports = item;

