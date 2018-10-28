const compressor = require('../test/dna-data-compressor.umd');

console.log('Test')
const sequence = 'ATTGGTACGACTGCAGCTGCATATTATAATGATCGATCGATCGTAC'

console.log(`Input data (DNA sequence): ${sequence}.`);
console.log(`Input data size: ${sequence.length} bytes.`);


const buffer = compressor.sequenceToBinaryData(sequence);


const binaryHandler = new Uint8Array(buffer);
console.log(`Compressed data (Uint8Array): ${binaryHandler}`);
console.log(`Compressed data size: ${binaryHandler.length} bytes.`);


const decompressed = compressor.binaryDataToSequence(buffer);

console.log(`Decompressed data: ${decompressed}`);