////////////////////////////////////////

const axios     = require('axios').default;
const cheerio   = require('cheerio');

const logger        = require('./logger');
const url_manager   = require('./url');
const item_manager  = require('./item');
const tx_manager    = require('./transaction');
const block_manager = require('./block');

class validator {

    constructor( url ) { this.url = new url_manager( url ); }

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
    }

    // private methods ////////////////////////////

    async _get_node_url() {
        var html_page = await axios.get( `${ this.url }` )
            .then( response => {
                logger('download web page');
                return response.data;
            })
            .catch( error => {
                logger('download web page', false);
                throw `error downloading viewer page: ${ error }`;
            });
        this._extract_node_url( html_page );
    }

    async _get_item() {
        var item = await axios.get( this.item_url )
            .then( response => {
                if ( response.data.length === 1 ) {
                    logger('download item');
                    return response.data[0];
                } else {
                    throw `expected one item, received ${ response.data.length }`;
                }
            })
            .catch( error => {
                    logger('download item', false);
                throw `error downloading item: ${ error }`;
            });
        this.item = new item_manager( item );
    }

    async _get_transaction() {
        var transaction_url = this.node_url + '/trx/sbi/' + this.item.id;
        var transaction = await axios.get( transaction_url )
            .then( response => {
                if ( response.data.length === 1 ) {
                    logger('download transaction');
                    return response.data[0];
                } else {
                    throw `expected one item, received ${ response.data.length }`;
                }
            })
            .catch( error => {
                logger('download transaction', false);
                throw `error downloading transaction: ${ error }`;
            });
        this.transaction = new tx_manager( transaction );
    }

    async _get_block() { // include la ricevuta
        var block_url = this.node_url + '/block/sbt/' + this.transaction.id;
        var block = await axios.get( block_url )
            .then( response => {
                logger('download block');
                return response.data; 
            })
            .catch( error => {
                console.log( error );
                logger('download block', false);
                throw `error downloading block: ${ error }`;
            });
        this.block = new block_manager( block, this.transaction.id );
    }

    _extract_node_url( html ) {
        try {
            var $ = cheerio.load( html );
            this.node_url = $('#node_url').text();
            logger('extract node url');
        } catch ( error ) {
            logger('extract node url', error);
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
   

}

module.exports = validator;

