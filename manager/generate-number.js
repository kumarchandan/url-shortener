// generate-number.js

function generate(url) {
    
    var hash = 0;
    if(url.length === 0) {
        return hash;
    }
    for (var i = 0; i < url.length; i++) {
        var char = url.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;             // convert to 32 bit integer
    }
    return Math.abs(hash);
}

module.exports = {
    generate: generate
}