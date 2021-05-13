////////////////////////////////////////

// this class is singleton
// -----------------------

const max = 28;

class logger {

    constructor( print = false ) {
        if ( logger.instance ) {
            return logger.instance;
        }
        this.print      = print;
        this.response   = true;
        this.errors     = [];
        logger.instance = this;
    }

    p( input, response = true, error = null ) {
        if ( response === false ) { this.response = false; this.errors.push( error === null ? input : error ); }
        if ( this.print ) {
            var string = ` - ${ input }`;
            for ( var i = max - input.length; i > -1; i-- ) {
                string += ' ';
            }
            string += ': ';
            string += response === true ? 'OK' : 'ERROR';
            console.log( string );
        }
    }

}

module.exports = logger;

