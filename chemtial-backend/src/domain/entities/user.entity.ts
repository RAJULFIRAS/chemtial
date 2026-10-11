export class User {
  constructor(
    public readonly id: string,
    private _name: string,
    private _email: string,
    private _passwordHash: string,
    private _role: string,
    private _isActive: boolean,
    private _refreshToken: string | null,
    private _refreshTokenExp: Date | null,
    private _lastSeen: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null = null,
    private _resetToken: string | null = null,
    private _resetTokenExp: Date | null = null,
  ) {}

  get name(): string {
    return this._name;
  }
  get email(): string {
    return this._email;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get role(): string {
    return this._role;
  }
  get isActive(): boolean {
    return this._isActive;
  }
  get refreshToken(): string | null {
    return this._refreshToken;
  }
  get refreshTokenExp(): Date | null {
    return this._refreshTokenExp;
  }
  get lastSeen(): Date | null {
    return this._lastSeen;
  }

  get resetToken(): string | null {
    return this._resetToken;
  }

  get resetTokenExp(): Date | null {
    return this._resetTokenExp;
  }

  updateResetToken(token: string | null, expiry: Date | null): void {
    this._resetToken = token;
    this._resetTokenExp = expiry;
    this.updatedAt = new Date();
  }

  updatePassword(passwordHash: string): void {
    this._passwordHash = passwordHash;
    this._resetToken = null;
    this._resetTokenExp = null;
    this.updatedAt = new Date();
  }

  updateName(name: string): void {
    if (name.length < 2) throw new Error("Name must be at least 2 characters");
    this._name = name;
    this.updatedAt = new Date();
  }

  updateRefreshToken(token: string | null, expiry: Date | null): void {
    this._refreshToken = token;
    this._refreshTokenExp = expiry;
    this.updatedAt = new Date();
  }

  updateLastSeen(): void {
    this._lastSeen = new Date();
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this.updatedAt = new Date();
  }
}
