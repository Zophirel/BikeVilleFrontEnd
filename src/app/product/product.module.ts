export class Product {
  productId: number;
  productCategoryId: number;
  parentProductCategoryId: number;
  name: string;
  productNumber: string;
  color: string;
  listPrice: number;
  size: string;
  weight: number;
  productModelId: number;
  sellStartDate: Date | null; 
  sellEndDate: string | null;
  thumbNailPhoto: string;
  thumbnailPhotoFileName: string;
  modifiedDate: Date | null;
  productCategory: any | null;
  productModel: any | null; 

  constructor(data: Partial<Product>) {
    this.productId = data.productId ?? 0;
    this.name = data.name ?? '';
    this.productNumber = data.productNumber ?? '';
    this.color = data.color ?? '';
    this.listPrice = data.listPrice ?? 0;
    this.size = data.size ?? '';
    this.weight = data.weight ?? 0;
    this.productCategoryId = data.productCategoryId ?? 0;
    this.parentProductCategoryId = data.parentProductCategoryId ?? 0;
    this.productModelId = data.productModelId ?? 0;
    this.sellStartDate = data.sellStartDate ?? null;
    this.sellEndDate = data.sellEndDate ?? null;
    this.thumbNailPhoto = data.thumbNailPhoto ?? '';
    this.thumbnailPhotoFileName = data.thumbnailPhotoFileName ?? '';
    this.modifiedDate = data.modifiedDate ?? null;
    this.productCategory = data.productCategory ?? null;
    this.productModel = data.productModel ?? null;
  }

  static fromJson(json: string): Product {
    const data = JSON.parse(json);
    return new Product({
      productId: data.productId,
      name: data.name,
      productNumber: data.productNumber,
      color: data.color,
      listPrice: data.listPrice,
      size: data.size,
      weight: data.weight,
      productCategoryId: data.productCategoryId,
      parentProductCategoryId: data.parentProductCategoryId,
      productModelId: data.productModelId,
      sellStartDate: data.sellStartDate,
      sellEndDate: data.sellEndDate,
      thumbNailPhoto: data.thumbNailPhoto,
      thumbnailPhotoFileName: data.thumbnailPhotoFileName,
      modifiedDate: data.modifiedDate,
      productCategory: data.productCategory,
      productModel: data.productModel,
    });
  }
}
