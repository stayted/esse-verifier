////////////////////////////////////////

const max = 28;

function string_spacer( input, response = true ) {

    var string = ` - ${ input }`;
    for ( var i = max - input.length; i > -1; i-- ) {
        string += ' ';
    }
    string += ': ';
    string += response === true ? 'OK' : 'ERROR';
    return string;

}

module.exports = string_spacer;

