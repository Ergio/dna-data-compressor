var Compressor = function () { };

Compressor.prototype.sequenceToBinaryData = function (sequenceString) {
    // define nucleotides and their binary equivalents
    var NUCLEOTIDE_TO_BIN = {
        'A': 0,
        'C': 1,
        'G': 2,
        'T': 3 // 0b11
    };
    var getTetrapletMap = function () {
        var nucleotides = Object.keys(NUCLEOTIDE_TO_BIN);
        var tetrapletsMap = {};
        for (var _i = 0, nucleotides_1 = nucleotides; _i < nucleotides_1.length; _i++) {
            var n1 = nucleotides_1[_i];
            for (var _a = 0, nucleotides_2 = nucleotides; _a < nucleotides_2.length; _a++) {
                var n2 = nucleotides_2[_a];
                for (var _b = 0, nucleotides_3 = nucleotides; _b < nucleotides_3.length; _b++) {
                    var n3 = nucleotides_3[_b];
                    for (var _c = 0, nucleotides_4 = nucleotides; _c < nucleotides_4.length; _c++) {
                        var n4 = nucleotides_4[_c];
                        var binaryValue = NUCLEOTIDE_TO_BIN[n1] |
                            (NUCLEOTIDE_TO_BIN[n2] << 2) |
                            (NUCLEOTIDE_TO_BIN[n3] << 4) |
                            (NUCLEOTIDE_TO_BIN[n4] << 6);
                        tetrapletsMap[n1 + n2 + n3 + n4] = binaryValue;
                    }
                }
            }
        }
        return tetrapletsMap;
    };
    // define tetraplets (four nucleotides) and their binary equivalents
    var TETRAPLET_TO_BIN = getTetrapletMap();
    // filter sequences letters, replace U on T
    var sequence = sequenceString.toUpperCase()
        .replace(/\s/g, '')
        .replace('U', 'T')
        .replace(/[^ATGC\-]/g, '');
    var length = sequence.length;
    // rough divide on 4
    var mainLength = length >>> 2;
    var residues = length & 3;
    var endPadding = residues ? 4 - residues : 0;
    var bufferSize = residues ? mainLength + 1 : mainLength;
    // one more byte for end-padding value
    var buffer = new ArrayBuffer(bufferSize + 1);
    var binaryDataHandler = new Uint8Array(buffer);
    // position in sequence
    var pos;
    var byteCounter;
    for (byteCounter = 0; byteCounter < mainLength; byteCounter++) {
        // multiply on 4
        pos = byteCounter << 2;
        var tetraplet = sequence[pos] + sequence[++pos] + sequence[++pos] + sequence[++pos];
        binaryDataHandler[byteCounter] = TETRAPLET_TO_BIN[tetraplet];
    }
    if (residues) {
        pos = byteCounter << 2;
        var binN1 = NUCLEOTIDE_TO_BIN[sequence[pos]];
        var binN2 = NUCLEOTIDE_TO_BIN[sequence[++pos]] || 0;
        var binN3 = NUCLEOTIDE_TO_BIN[sequence[++pos]] || 0;
        var binN4 = 0;
        binaryDataHandler[byteCounter] = binN1 | (binN2 << 2) | (binN3 << 4) | binN4;
    }
    // last byte is using for saving end-padding value
    binaryDataHandler[++byteCounter] = endPadding;
    return buffer;
};
Compressor.prototype.binaryDataToSequence = function (buffer) {
    var BIN_TO_NUCLEOTIDE = {
        '0': 'A',
        '1': 'C',
        '2': 'G',
        '3': 'T' // 0b11
    };
    var binHandler = new Uint8Array(buffer);
    var sequence = '';
    var len = binHandler.length - 1;
    for (var i = 0; i < len; i++) {
        sequence += BIN_TO_NUCLEOTIDE[binHandler[i] & 3];
        sequence += BIN_TO_NUCLEOTIDE[(binHandler[i] >>> 2) & 3];
        sequence += BIN_TO_NUCLEOTIDE[(binHandler[i] >>> 4) & 3];
        sequence += BIN_TO_NUCLEOTIDE[(binHandler[i] >>> 6) & 3];
    }
    if (binHandler[len]) {
        sequence = sequence.slice(0, -binHandler[len]);
    }
    return sequence;
};

