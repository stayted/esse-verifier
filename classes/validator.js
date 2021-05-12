////////////////////////////////////////

const axios     = require('axios').default;
const cheerio   = require('cheerio');

const url_manager = require('./url_manager');

class validator {

    constructor( url ) { this.url = new url_manager( url ); }

    // public methods /////////////////////////////

    async init() {
        this.url.validate();
        await this._get_node_url();
        await this._get_item();
    }

    // private methods ////////////////////////////

    async _get_node_url() {
        var html_page = await axios.get( `${ this.url }` )
            .then( response => {
                console.log('  - download web page: OK');
                return response.data;
            })
            .catch( error => {
                console.log('  - download web page: error');
                throw `error downloading viewer page: ${ error }`;
            });
        this._extract_node_url( html_page );
    }

    async _get_item() {
        this.item = await axios.get( this.item_url )
            .then( response => {
                console.log('  - download item: OK');
                return response.data;
            })
            .catch( error => {
                console.log('  - download item: error');
                throw `error downloading item: ${ error }`;
            });
    }

    _get_transaction() {}

    _validate_item_id() {}

    _validate_transaction_id() {}

    _get_block() {} // include la ricevuta

    _verify_block() {}

    _extract_node_url( html ) {
        try {
            var $ = cheerio.load( html );
            this.node_url = $('#node_url').text();
            console.log('  - extract node url: OK');
        } catch ( error ) {
            console.log('  - extract node url: ERROR');
            throw `error extracting node url: ${ error }`;
        }
    }

    // getters & setters //////////////////////////

    get item_url() {
        return this.node_url + '/item?code=' + this.url.code;
    }

}

module.exports = validator;

