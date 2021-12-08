class ShortCutHashGenerator {
  sequenceStartIdentifier = "-start-";
  firstHash = "aaa";
  last: string;
  charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  encodingSet: Record<string, number>;

  constructor() {
    this.last = this.sequenceStartIdentifier;
    this.encodingSet = this.charSet
      .split("")
      .reduce((a, v, i) => ({ ...a, [v]: i }), {});
  }

  setCurrentHash(current: string) {
    this.last = current;
  }

  next() {
    if (this.last === this.sequenceStartIdentifier) {
      this.last = this.firstHash;
    } else {
      this.incrementHash();
    }
    return this.last;
  }

  private incrementHash() {
    const currentValue = this.decodeDigits(this.last);
    let incremented = false;

    for (let i = currentValue.length - 1; i >= 0; i--) {
      if (currentValue[i] < this.charSet.length - 1) {
        currentValue[i] += 1;
        incremented = true;
        for (let z = i + 1; z < currentValue.length; z++) {
          currentValue[z] = 0;
        }
        break;
      }
    }
    if (!incremented) currentValue.push(1);
    this.last = this.encodeDigits(currentValue);
    return this.last;
  }

  private encodeDigits(digits: number[]) {
    const encodedArray: string[] = [];

    for (let i = 0; i < digits.length; i++) {
      encodedArray.push(this.charSet[digits[i]]);
    }

    return encodedArray.join("");
  }

  private decodeDigits(hash: string) {
    const digit: number[] = [];

    for (let i = 0; i < hash.length; i++) {
      digit.push(this.encodingSet[hash[i]]);
    }

    return digit;
  }
}

export default ShortCutHashGenerator;
