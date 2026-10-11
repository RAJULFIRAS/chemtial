export class Brand {
  constructor(
    public readonly id: string,
    private _name: string,
    private _slug: string,
    private _description: string | null,
    private _logo: string | null,
    private _website: string | null,
    private _isActive: boolean,
    private _sortOrder: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null = null,
    private _productCount: number = 0,
  ) {}

  get name(): string {
    return this._name;
  }
  get slug(): string {
    return this._slug;
  }
  get description(): string | null {
    return this._description;
  }
  get logo(): string | null {
    return this._logo;
  }
  get website(): string | null {
    return this._website;
  }
  get isActive(): boolean {
    return this._isActive;
  }
  get sortOrder(): number {
    return this._sortOrder;
  }
  get productCount(): number {
    return this._productCount;
  }

  updateName(name: string): void {
    if (name.length < 2) throw new Error("Name must be at least 2 characters");
    this._name = name;
    this.updatedAt = new Date();
  }
}
