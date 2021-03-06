////////////////////////////////////////

const axios     = require('axios').default;
const cheerio   = require('cheerio');

const logger        = require('./logger');
const url_manager   = require('./url');
const item_manager  = require('./item');
const tx_manager    = require('./transaction');
const block_manager = require('./block');

class validator {

    constructor( url, print_log = false ) {
        this.logger = new logger( print_log );
        this.url    = new url_manager( url );
    }

    // public methods /////////////////////////////

    async check() {
        this.url.validate();
        await this._get_node_url();
        await this._get_item();
        await this._get_transaction();
        this.item.validate( this.public_key );
        this.transaction.validate();
        await this._get_block();
        await this.block.validate();
        return this.logger.response;
    }

    // private methods ////////////////////////////

    async _get_node_url() {
        var html_page = await axios.get( `${ this.url }` )
            .then( response => {
                this.logger.p('download web page');
                return response.data;
            })
            .catch( error => {
                this.logger.p('download web page', false, error);
                throw `error downloading viewer page: ${ error }`;
            });
        this._extract_node_url( html_page );
    }

    async _get_item() {
        var item = await axios.get( this.item_url )
            .then( response => {
                if ( response.data.length === 1 ) {
                    this.logger.p('download item');
                    return response.data[0];
                } else {
                    if ( response.data.length === 0 ) {
                        throw `expected one item, received ${ response.data.length }. Try to wait a few minutes`;
                    }
                    throw `expected one item, received ${ response.data.length }`;
                }
            })
            .catch( error => {
                this.logger.p('download item', false, error);
                throw `error downloading item: ${ error }`;
            });
        this.item = new item_manager( item );
    }

    async _get_transaction() {
        var transaction_url = this.node_url + '/trx/sbi/' + this.item.id;
        var transaction = await axios.get( transaction_url )
            .then( response => {
                if ( response.data.length === 1 ) {
                    this.logger.p('download transaction');
                    return response.data[0];
                } else {
                    throw `expected one item, received ${ response.data.length }`;
                }
            })
            .catch( error => {
                this.logger.p('download transaction', false, error);
                throw `error downloading transaction: ${ error }`;
            });
        this.transaction = new tx_manager( transaction );
    }

    async _get_block() { // include la ricevuta
        var block_url = this.node_url + '/block/sbt/' + this.transaction.id;
        var block = await axios.get( block_url )
            .then( response => {
                this.logger.p('download block');
                return response.data; 
            })
            .catch( error => {
                var message = error.response.data.hasOwnProperty('description') ? error.response.data.description : error;
                if ( message === 'expected 1 block, found 0' ) {
                    message += '. Try to wait a few minutes'
                }
                this.logger.p('download block', false, error);
                throw `error downloading block: ${ message }`;
            });
        this.block = new block_manager( block, this.transaction.id );
    }

    _extract_node_url( html ) {
        try {
            var $ = cheerio.load( html );
            this.node_url = $('#node_url').text();
            this.logger.p('extract node url');
        } catch ( error ) {
            this.logger.p('extract node url', error);
            throw `error extracting node url: ${ error }`;
        }
    }

    // getters & setters //////////////////////////

    get item_url() {
        return this.node_url + '/item?code=' + this.url.code;
    }

    get public_key() {
        return this.transaction.public_key;
    }

    get response() {
        return this.logger.response;
    }

    get errors() {
        return this.logger.errors;
    }
   

}

module.exports = validator;

