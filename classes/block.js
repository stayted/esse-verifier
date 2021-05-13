////////////////////////////////////////

const axios = require('axios').default;

const logger = require('./logger');
const mtree  = require('./merkle_tree');
const chain  = require('./chain');

class block {

    constructor( payload, transaction_id ) {
        this.payload        = payload;
        this.transaction_id = transaction_id;
        this.logger         = new logger();
    }

    // public methods /////////////////////////////

    async validate() {
        this._verify_merkle_tree();
        this._verify_block_status();
        await this._verify_btc_page_details();
        this._verify_receipt();
    }

    // private methods ////////////////////////////

    _verify_merkle_tree() {
        try {
            this.tree = new mtree( this.leaves );
            var root = this.tree.get_root();
        } catch ( error ) {
            this.logger.p('verify merkle tree', false);
            throw `error verifying merkle tree: ${ error }`;
        }
        if ( root === this.merkle_root && this.merkle_root === this.payload.receipt.btc_receipt.hash ) {
            this.logger.p('verify merkle tree');
        } else {
            this.logger.p('verify merkle tree', false);
        }
    }

    _verify_block_status() {
        if ( this.status === 'locked' ) {
            this.logger.p('verify block status');
        } else {
            this.logger.p('verify block status', false);
            throw 'il blocco non è stato ancora notarizzato, verifica interrotta.';
        }
    }

    async _verify_btc_page_details() {
        var html_page = await axios.get( this.btc_block_url )
            .then( response => {
                this.logger.p('download btc page');
                return response.data;
            })
            .catch( error => {
                this.logger.p('download btc page', false);
                throw `error downloading viewer page: ${ error }`;
            });
        var btc_merkle_root = this._extract_btc_merkle_root( html_page );
        if ( btc_merkle_root === this.btc_merkle_root ) {
            this.logger.p('verify btc merkle root');
        } else {
            this.logger.p('verify btc merkle root', false);
        }
    }

    _extract_btc_merkle_root( html ) {
        var html_rows = html.split('\n');
        var merkle_row = null;
        for ( var a = 0; a < html_rows.length; a++ ) {
            if ( html_rows[ a ].includes('Merkle Root') ) {
                merkle_row = html_rows[ a + 1 ];
                break;
            }
        }
        if ( merkle_row === null ) {
            this.logger.p('search for btc merkle root', false);
            throw 'correct row not found';
        }
        var match = merkle_row.match(/.+<dd class="text-muted"> {0,1}([a-z0-9]+) {0,1}<\/dd>/);
        if ( !match ) {
            this.logger.p('search for btc merkle root', false);
            throw 'correct row not found';
        }
        this.logger.p('search for btc merkle root');
        return match[1];
    }

    _verify_receipt() {
        // verify esse_merkle_root receipt
        var is_valid = new chain( this.btc_merkle_root, this.receipt, this.merkle_root ).verify();
        if ( is_valid === false ) {
            this.logger.p('verify chainpoint receipt', false);
        }
        this.logger.p('verify chainpoint receipt');

        // verify single tx receipt
        //var tree = new merkle( block.leaves );
        var temp_receipt = this.tree.get_receipt( this.transaction_id );
        var receipt = JSON.parse( JSON.stringify( this.receipt ) );
        receipt.branches[0].ops = receipt.branches[0].ops.concat( temp_receipt.siblings );
        var is_valid = new chain( this.btc_merkle_root, receipt, this.transaction_id ).verify();
        if ( is_valid === false ) {
            this.logger.p('verify transaction receipt', false);
        }
        this.logger.p('verify transaction receipt');
    }

    // getters & setters //////////////////////////

    get height() {
        return this.payload.height;
    }

    get leaves() {
        return this.payload.leaves;
    }

    get merkle_root() {
        return this.payload.esse_merkle_root;
    }

    get btc_height() {
        return this.payload.receipt.btc_block_height;
    }

    get status() {
        return this.payload.receipt.status;
    }

    get btc_block_url() {
        return this.payload.receipt.btc_receipt.branches[1].block_url;
    }

    get btc_merkle_root() {
        return this.payload.receipt.btc_merkle_root;
    }

    get receipt() {
        return this.payload.receipt.btc_receipt;
    }

}

module.exports = block;

