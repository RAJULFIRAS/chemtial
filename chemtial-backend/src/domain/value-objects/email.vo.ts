export class Email {
  private readonly _value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error("Invalid email format");
    }
    this._value = email.toLowerCase();
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
