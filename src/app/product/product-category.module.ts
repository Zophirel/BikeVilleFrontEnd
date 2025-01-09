import { Product } from './product.module'; 

export class ProductCategory {
  productCategoryId: number;
  parentProductCategoryId?: number | null;
  name: string;
  rowguid: string;
  modifiedDate: Date;
  products: Product[]; // Tipizzato come array di Product

  constructor(
    productCategoryId: number,
    parentProductCategoryId: number | null,
    name: string,
    rowguid: string,
    modifiedDate: Date,
    products: Product[] = [] // Inizializzazione di default con un array vuoto
  ) {
    this.productCategoryId = productCategoryId;
    this.parentProductCategoryId = parentProductCategoryId;
    this.name = name;
    this.rowguid = rowguid;
    this.modifiedDate = modifiedDate;
    this.products = products; // Aggiungi l'array di prodotti nel costruttore
  }
}