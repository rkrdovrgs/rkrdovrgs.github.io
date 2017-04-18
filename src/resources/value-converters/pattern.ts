export class PatternValueConverter {
  toView(value, pattern: string): string {
    let rgx = new RegExp(pattern),
      matches = rgx.exec(value);

    return matches ? matches[0] : null;
  }
}

