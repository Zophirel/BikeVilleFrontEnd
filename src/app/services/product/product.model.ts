export interface Product {
    productId: number;
    name: string;
    productNumber: string;
    color: string;
    standardCost: number;
    listPrice: number;
    size?: string;
    weight?: number;
    productCategoryId: number;
    productModelId: number;
    sellStartDate: string;
    sellEndDate: string;
    discontinuedDate: string;
    thumbNailPhoto?: string;
    thumbnailPhotoFileName: string;
    rowguid: string;
    modifiedDate: string;
    productCategory?: {
      productCategoryId: number;
      parentProductCategoryId: number;
      name: string;
      rowguid: string;
      modifiedDate: string;
      inverseParentProductCategory: string[];
      parentProductCategory: string;
      products: string[];
    };
    productModel?: {
      productModelId: number;
      name: string;
      catalogDescription: string;
      rowguid: string;
      modifiedDate: string;
      productModelProductDescriptions: Array<{
        productModelId: number;
        productDescriptionId: number;
        culture: string;
        rowguid: string;
        modifiedDate: string;
        productDescription: {
          productDescriptionId: number;
          description: string;
          rowguid: string;
          modifiedDate: string;
          productModelProductDescriptions: string[];
        };
      }>;
      products: string[];
    };
    
  }
  
  export interface ProductDescription {
    productDescriptionId: number;
    description: string;
    rowguid: string;
    modifiedDate: string;
  }
    