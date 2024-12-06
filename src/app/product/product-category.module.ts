export class ProductCategory {
  productCategoryId: number;
  parentProductCategoryId?: number | null;
  name: string;
  rowguid: string; 
  modifiedDate: Date;

  constructor(
    productCategoryId: number,
    parentProductCategoryId: number | null,
    name: string,
    rowguid: string,
    modifiedDate: Date,
  ) 
  {
    this.productCategoryId = productCategoryId;
    this.parentProductCategoryId = parentProductCategoryId;
    this.name = name;
    this.rowguid = rowguid;
    this.modifiedDate = modifiedDate;
  }
}