# DNA DATA COMPRESSOR
**dna-data-compessor** is a tiny library, it can quick convert (and compress) DNA sequences data (string data type in javascript) to binary data and vice versa. It can provide maximum level of DNA data compression (we suppose that allocation of nucleotides is random).<br />

This can be useful for data transfering or fast data analysis of DNA sequences.<br />
So, every nucleotide is encoded by 2 bytes (UTF-16), in some cases - 1  byte (ASCII, UTF-8).
But, actualy, we need just two bits to encode one nucleotide. For example:<br />
      A - 00<br />
      C - 01<br />
      G - 10<br />
      T - 11<br />
By this way, we can compress DNA sequences data in **4-8 times**.

## Web

In order to use dna-data-compressor on a webpage, download dna-compressor.js from the web folder of this repository and include it in a script, like so (assuming it is in the same directory as your page):
```bash
<script src="dna-compressor.js"></script>
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
```bash
// Some DNA sequence
const sequence = 'ATTGGTACGACTGCAGCTGCATATTATAATGATCGATCGATCGTAC'

// Compress string to binary data (ArrayBuffer)
const buffer = compressor.sequenceToBinaryData(sequence);

// Decompess binary data to string
const decompressed = compressor.binaryDataToSequence(buffer);
```
  
## NPM scripts

 - `npm test`: Run simple test (test folder)

