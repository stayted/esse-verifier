////////////////////////////////////////

const cpb    = require('chainpoint-binary');
const crypto = require('crypto');

class main {

    constructor( mroot, receipt, hash ) {
        this.mroot    = mroot;
        this.ops      = [];
        this.is_valid = false;
        this._set_receipt( receipt );
        this.hash     = hash;
    }

    // public methods /////////////////////////////

    verify() {
        this._set_ops();
        this._perform_ops();
        return this.is_valid;
    }

    // private methods ////////////////////////////

    _perform_ops() {
        var string = Buffer.from(this.hash, 'hex');
        for ( var i = 0; i < this.ops.length; i++ ) {
            var obj = this.ops[ i ];
            if ( Object.keys( obj )[0] === 'l' ) {
                let concat_value = this._is_hex(obj['l'])
                    ? Buffer.from(obj['l'], 'hex')
                    : Buffer.from(obj['l'], 'utf8');
                string = Buffer.concat( [ concat_value, string ] );
            } else if ( Object.keys( obj )[0] === 'r' ) {
                let concat_value = this._is_hex(obj['r'])
                    ? Buffer.from(obj['r'], 'hex')
                    : Buffer.from(obj['r'], 'utf8');
                string = Buffer.concat( [ string, concat_value ] );
            } else if ( Object.keys( obj )[0] === 'op' ) {
                switch ( obj.op ) {
                    case 'sha-256':
                        string = crypto
                            .createHash('sha256')
                            .update(string)
                            .digest()
                        break
                    case 'sha-256-x2':
                        string = crypto
                            .createHash('sha256')
                            .update(string)
                            .digest()
                        string = crypto
                            .createHash('sha256')
                            .update(string)
                            .digest()
                        break
                }
            }
        }
        
        var calculated_mroot = string.toString('hex')
            .match(/.{2}/g)
            .reverse()
            .join('')
        
        this.is_valid = calculated_mroot === this.mroot;
    }

    // verifica se la stringa è esadecimale
    _is_hex( value ) {
        var hex_regex = /^[0-9A-Fa-f]{2,}$/
        var result = hex_regex.test(value)
        if (result) result = !(value.length % 2)
        return result
    }

    // verifica se la stringa è in base64
    _is_b64( string ) {
        try {
            var b64 = Buffer.from(string, 'base64');
        } catch( error ) {
            return false;
        }
        return b64;
    }

    // setta le ops
    _set_ops() {
        if ( this.ops.length > 0 ) { this.ops = []; }
        this._parse_receipt_keys();
    }

    // analizza le chiavi di un obj in cerca degli attrs 'branches' e 'ops'
    _parse_receipt_keys( obj = this.receipt ) {
        var keys = Object.keys( obj );
        for ( var i = 0; i < keys.length; i++ ) {
            if ( keys[ i ] == 'branches' && Array.isArray( obj[ keys[ i ] ] ) ) {
                for ( var a = 0; a < obj[ keys[ i ] ].length; a++ ) {
                    this._parse_receipt_keys( obj[ keys[ i ] ][ a ] );
                }
            } else if ( keys[ i ] === 'ops' && Array.isArray( obj[ keys[ i ] ] ) ) {
                //this.ops = this.ops.concat( obj[ keys[ i ] ] );
                for ( var a = 0; a < obj[ keys[ i ] ].length; a++ ) {
                    var op = obj[ keys[ i ] ][ a ];
                    if ( typeof op === 'object' && Object.keys( op ).length === 1 && ['op', 'l', 'r'].includes( Object.keys( op )[0] ) ) {
                        this.ops.push( op );
                    }
                }
            }
            
        }
    }

    // setta la receipt, accetta base64, string e object
    _set_receipt( receipt ) {
         if ( this._is_b64( receipt ) && this._is_b64( receipt ).toString('base64') === receipt ) {
            this.receipt = cpb.binaryToObjectSync( receipt );
         } else if ( typeof receipt === 'object' ) {
             this.receipt = receipt;
         } else if ( typeof receipt === 'string' ) {
             this.receipt = JSON.parse(receipt);
         }
    }

}

module.exports = main;

