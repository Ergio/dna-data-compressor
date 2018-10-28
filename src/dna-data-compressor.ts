// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
interface NucleotidesToNumbersMap {
  [nucleotides: string]: number;
}

interface NumbersToNucleotidesMap {
  [numbers: number]: string;
}
export default class Compressor {
  static sequenceToBinaryData(sequenceString: string): ArrayBuffer {
    // define nucleotides and their binary equivalents
    const NUCLEOTIDE_TO_BIN: NucleotidesToNumbersMap = {
      'A': 0,    // 0b00
      'C': 1,    // 0b01
      'G': 2,    // 0b10
      'T': 3     // 0b11
    };

    const getTetrapletMap = (): NucleotidesToNumbersMap => {
      const nucleotides = Object.keys(NUCLEOTIDE_TO_BIN);
      const tetrapletsMap: NucleotidesToNumbersMap = {};
      for (const n1 of nucleotides) {
        for (const n2 of nucleotides) {
          for (const n3 of nucleotides) {
            for (const n4 of nucleotides) {
              const binaryValue = NUCLEOTIDE_TO_BIN[n1] |
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
    const TETRAPLET_TO_BIN = getTetrapletMap();

    // filter sequences letters, replace U on T
    const sequence = sequenceString.toUpperCase()
      .replace(/\s/g, '')
      .replace('U', 'T')
      .replace(/[^ATGC\-]/g, '');

    const length = sequence.length;
    // rough divide on 4
    const mainLength = length >>> 2;
    const residues = length & 3;
    const endPadding = residues ? 4 - residues : 0;

    const bufferSize = residues ? mainLength + 1 : mainLength;
    // one more byte for end-padding value
    const buffer = new ArrayBuffer(bufferSize + 1);
    const binaryDataHandler = new Uint8Array(buffer);

    // position in sequence
    let pos: number;
    let byteCounter: number;
    for (byteCounter = 0; byteCounter < mainLength; byteCounter++) {
      // multiply on 4
      pos = byteCounter << 2;
      const tetraplet = sequence[pos] + sequence[++pos] + sequence[++pos] + sequence[++pos];
      binaryDataHandler[byteCounter] = TETRAPLET_TO_BIN[tetraplet];
    }

    if (residues) {
      pos = byteCounter << 2;
      const binN1 = NUCLEOTIDE_TO_BIN[sequence[pos]];
      const binN2 = NUCLEOTIDE_TO_BIN[sequence[++pos]] || 0;
      const binN3 = NUCLEOTIDE_TO_BIN[sequence[++pos]] || 0;
      const binN4 = 0;
      binaryDataHandler[byteCounter] = binN1 | (binN2 << 2) | (binN3 << 4) | binN4;
    }

    // last byte is using for saving end-padding value
    binaryDataHandler[++byteCounter] = endPadding;

    return buffer;
  }

  static binaryDataToSequence(buffer: ArrayBuffer): string {
    const BIN_TO_NUCLEOTIDE: NumbersToNucleotidesMap = {
      '0': 'A',    // 0b00
      '1': 'C',    // 0b01
      '2': 'G',    // 0b10
      '3': 'T'     // 0b11
    };

    const binHandler = new Uint8Array(buffer);
    let sequence = '';
    const len: number = binHandler.length - 1;
    for (let i = 0; i < len; i++) {
      sequence += BIN_TO_NUCLEOTIDE[binHandler[i] & 3];
      sequence += BIN_TO_NUCLEOTIDE[(binHandler[i] >>> 2) & 3];
      sequence += BIN_TO_NUCLEOTIDE[(binHandler[i] >>> 4) & 3];
      sequence += BIN_TO_NUCLEOTIDE[(binHandler[i] >>> 6) & 3];
    }

    if (binHandler[len]) {
      sequence = sequence.slice(0, - binHandler[len]);
    }

    return sequence;
  }
}
