export class Password {
  private readonly _hash: string;

  constructor(password: string, hashed?: boolean) {
    if (!hashed && !this.isValid(password)) {
      throw new Error(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
      );
    }
    this._hash = hashed ? password : this._hashPassword(password);
  }

  private isValid(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  }

  private _hashPassword(password: string): string {
    return password;
  }

  get hash(): string {
    return this._hash;
  }
}
