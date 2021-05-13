////////////////////////////////////////

const max = 28;

function logger( input, response = true ) {

    var string = ` - ${ input }`;
    for ( var i = max - input.length; i > -1; i-- ) {
        string += ' ';
    }
    string += ': ';
    string += response === true ? 'OK' : 'ERROR';
    console.log( string );

}

module.exports = logger;

