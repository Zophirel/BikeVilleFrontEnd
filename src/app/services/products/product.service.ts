import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../product/product.module';
import { ProductCategory } from '../../product/product-category.module';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  products: Product[] = [];
  categories: ProductCategory[] = [];

  constructor(private http: HttpClient) { }
  
  getAllProducts() {
    return this.http.get<Product[]>('https://localhost:5078/api/product/view');
  }

  organizeProducts(data: Product[]): Map<string, Product[]> {
    return data.reduce((map, product) => {
      const existingProducts = map.get(product.name) || [];
      map.set(product.name, [...existingProducts, product]);
      return map;
    }, new Map<string, Product[]>());
  }


  getAllProductCategories(){
    return this.http.get<ProductCategory[]>('https://localhost:5078/api/productCategory')
  }

  bindProductToCategory(
    products: Map<string, Product[]>, 
    categories: Map<ProductCategory, ProductCategory[]>
  ): Map<ProductCategory, Map<string, Product[]>> {
   
    const productsMap = new Map<ProductCategory, Map<string, Product[]>>();
    const tempMap = new Map<number, ProductCategory>();
    
    for (const category of categories.keys()) {
      tempMap.set(category.productCategoryId!, category);
    }
  
    for (const [productName, productArray] of products) {
      const parentCategoryId = productArray[0].parentProductCategoryId;
      const category = tempMap.get(parentCategoryId!);
  
      if (category) {
        if (productsMap.has(category)) {
          productsMap.get(category)?.set(productName, productArray);
       
        } else{
          productsMap.set(category, new Map([[productName, productArray]]));
        }
      }
    }
  
    return productsMap;
  }
  

  organizeCategories(data: ProductCategory[]): Map<ProductCategory, ProductCategory[]> {
    const allCategories = new Map<ProductCategory, ProductCategory[]>();
    const tempCatMap = new Map<number, ProductCategory>();
  
    for (const category of data) {
      tempCatMap.set(category.productCategoryId!, category);
    }
  
    for (const category of data) {
      if (category.parentProductCategoryId == null) {
        allCategories.set(category, []);
      } else {
        const parentCategory = tempCatMap.get(category.parentProductCategoryId!);
        if (parentCategory) {
          if (!allCategories.has(parentCategory)) {
            allCategories.set(parentCategory, []);
          }
          allCategories.get(parentCategory)?.push(category);
        }
      }
    }
  
    return allCategories;
  }
  


}
