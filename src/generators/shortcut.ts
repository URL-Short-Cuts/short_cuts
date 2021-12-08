const firstValue = "aaa";
const lastValue = "999";

class ShortCutHash {
  last: string;
  asciiBounds = [
    [96, 122],
    [64, 90],
    [47, 57],
  ];

  constructor(last = firstValue) {
    this.last = last;
  }

  next() {
    if (this.last === lastValue) return firstValue;
    return this.incrementHash();
  }

  private incrementHash(): string {
    const parsed: string[] = this.last.split("").reverse();
    const incremented: Record<number, string> = {};

    for (let index = 0; index < parsed.length; index++) {
      const new_char = this.incrementChar(parsed[index]);
      if (new_char !== parsed[index]) {
        incremented[index] = new_char;
        break;
      }
    }

    for (const index of Object.keys(incremented).map(Number)) {
      parsed[index] = incremented[index];
    }
    return parsed.reverse().join("");
  }

  private incrementChar(char: string): string {
    const code = char.charCodeAt(0);

    for (const bound of this.asciiBounds) {
      if (code > bound[0] && code < bound[1])
        return String.fromCharCode(code + 1);
    }

    if (code == 122) return "A";
    if (code == 90) return "1";

    return char;
  }
}

export default ShortCutHash;
