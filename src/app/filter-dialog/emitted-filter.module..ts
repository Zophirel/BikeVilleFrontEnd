import { ProductCategory } from "../product/product-category.module";
import { Product } from "../product/product.module";

export class EmittedFilterValue {
    constructor(
        public category: ProductCategory,
        public name: string,
        public id: number,
        public selected: boolean
    ) {}
}

export class EmittedOrderValue {
    constructor(
        public category: ProductCategory,
        public orderBy: number | null,
        public orderDirection: boolean
    ) {}
}