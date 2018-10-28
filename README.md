# DNA DATA COMPRESSOR

We can compress DNA sequences data in 4-8 times. This can be useful for data transfering or fast data analysis of DNA.

So, every nucleotide is encoded by 2 bytes (UTF-16), in some cases - 1  byte (ASCII, UTF-8).

But, actualy, we need just two bits to encode one nucleotide. For example:
      A - 00
      C - 01
      G - 10
      T - 11
dna-data-compessor is a small library, that can quick convert strings to binary data and vice versa. This method provide maximum level of DNA data compression (we suppose that allocation of nucleotides is random).

## Web

In order to use dna-data-compressor on a webpage, download dna-compressor.js from the web folder of this repository and include it in a script, like so (assuming it is in the same directory as your page):
```bash
<script src="ntseq.js"></script>
```

And use it, like so:
```bash
<script>
	const compressor = new Compressor();
<script>
```
  

## Node

You can use dna-data-compressor in your node project. Download dna-data-compressor.umd.js from the dist folder of this repository. Then include it in your script:
```bash
const compressor = require('../path/dna-data-compressor.umd');
```

## Usage
// Some DNA sequence
const sequence = 'ATTGGTACGACTGCAGCTGCATATTATAATGATCGATCGATCGTAC'

// Copress string to binary data (ArrayBuffer)
const buffer = compressor.sequenceToBinaryData(sequence);

// Decompess binary data to string
const decompressed = compressor.binaryDataToSequence(buffer);

## NPM scripts

 - `npm test`: Run simple test (test folder)

