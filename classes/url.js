////////////////////////////////////////

const valid_url = require('valid-url');
const url       = require('url');

const logger = require('./logger');

class url_manager {

    constructor( url ) {
        this.url    = url;
        this.logger = new logger();
    }

    // public methods /////////////////////////////

    validate() {
        if ( valid_url.isUri( this.url ) === false ) {
            this.logger.p('validate url', false);
            throw 'param doesn\t seem to be a valid url';
        }
        var params = this.qry_params;
        if ( Object.keys( params ).length === 1 && Object.keys( params )[0] === 'code' && params['code'] ) {
            this.logger.p('validate url');
        } else {
            this.logger.p('validate url', false);
            throw 'url must contain a single query parameter: code';
        }
    }

    toString() { return this.url; }

    // getters & setters //////////////////////////

    get qry_params() {
        return url.parse( this.url, true ).query;
    }

    get code() {
        return this.qry_params.code;
    }

}

module.exports = url_manager;

