////////////////////////////////////////

const { MerkleTree } = require('merkletreejs')
const crypto         = require('crypto');
const SHA256         = require('crypto-js/sha256')

class mtree {

    constructor (leaves, options = {}) {
        this.leaves = leaves;
        this.tree = new MerkleTree( this.leaves, SHA256 );
    }

    // public methods /////////////////////////////

    get_root() {
        return this.tree.getRoot().toString('hex');
    }

    get_proof(leaf) {
        return this.tree.getProof(leaf);
    }

    get_receipt(leaf) {
        var proof = {
            root     : this.get_root(),
            hash     : mtree.bufferize(leaf),
            context  : 'esse:receipt:v0.1',
            level    : 'esse',
            siblings : []
        };
        var branches = this.get_proof(leaf).map(x => {
            var res = {}
            switch (x.position) {
                case 'left':
                    res.l = x.data.toString('hex');
                    break;
                case 'right':
                    res.r = x.data.toString('hex');
                    break;
            }
            return res;
        })
        for (var i = 0; i < branches.length; i++) {
            proof.siblings.push(branches[ i ]);
            proof.siblings.push({ op: 'sha-256' });
        }
        return proof
    }

    // static methods /////////////////////////////

    static bufferize(object) {
        return MerkleTree.bufferify(object).toString('hex');
    }

}

module.exports = mtree;

