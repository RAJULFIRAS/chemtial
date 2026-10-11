export interface ProductImage {
  id: string;
  image: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductUnit {
  id: string;
  unit: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export class Product {
  constructor(
    public readonly id: string,
    private _name: string,
    private _nameEn: string | null,
    private _nameZh: string | null,
    private _nameHi: string | null,
    private _nameRu: string | null,
    private _nameAr: string | null,
    private _description: string | null,
    private _descriptionEn: string | null,
    private _descriptionZh: string | null,
    private _descriptionHi: string | null,
    private _descriptionRu: string | null,
    private _descriptionAr: string | null,
    private _brand: string,
    private _brandId: string | null,
    private _category: string,
    private _categoryId: string | null,
    private _price: number,
    private _image: string,
    private _rating: number,
    private _reviews: number,
    private _unit: string,
    private _isPromo: boolean,
    private _promoDiscount: number | null,
    private _casNumber: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null = null,
    private _images: ProductImage[] = [],
    private _units: ProductUnit[] = [],
  ) {}

  get name(): string {
    return this._name;
  }
  get nameEn(): string | null {
    return this._nameEn;
  }
  get nameZh(): string | null {
    return this._nameZh;
  }
  get nameHi(): string | null {
    return this._nameHi;
  }
  get nameRu(): string | null {
    return this._nameRu;
  }
  get nameAr(): string | null {
    return this._nameAr;
  }
  get description(): string | null {
    return this._description;
  }
  get descriptionEn(): string | null {
    return this._descriptionEn;
  }
  get descriptionZh(): string | null {
    return this._descriptionZh;
  }
  get descriptionHi(): string | null {
    return this._descriptionHi;
  }
  get descriptionRu(): string | null {
    return this._descriptionRu;
  }
  get descriptionAr(): string | null {
    return this._descriptionAr;
  }
  get brand(): string {
    return this._brand;
  }
  get brandId(): string | null {
    return this._brandId;
  }
  get category(): string {
    return this._category;
  }
  get categoryId(): string | null {
    return this._categoryId;
  }
  get price(): number {
    return this._price;
  }
  get image(): string {
    return this._image;
  }
  get rating(): number {
    return this._rating;
  }
  get reviews(): number {
    return this._reviews;
  }
  get unit(): string {
    return this._unit;
  }
  get isPromo(): boolean {
    return this._isPromo;
  }
  get promoDiscount(): number | null {
    return this._promoDiscount;
  }
  get casNumber(): string | null {
    return this._casNumber;
  }
  get images(): ProductImage[] {
    return this._images;
  }
  get units(): ProductUnit[] {
    return this._units;
  }

  get discountedPrice(): number {
    if (this._isPromo && this._promoDiscount) {
      return (
        Math.round(this._price * (1 - this._promoDiscount / 100) * 100) / 100
      );
    }
    return this._price;
  }

  get inStock(): boolean {
    if (this._units.length === 0) return true;
    return this._units.some((u) => u.isActive && u.stock > 0);
  }

  updatePrice(price: number): void {
    if (price <= 0) throw new Error("Price must be positive");
    this._price = price;
    this.updatedAt = new Date();
  }
}
