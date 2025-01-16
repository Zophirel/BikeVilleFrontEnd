export interface CartItem {
    orderQty: number;
    productId: number | undefined;
    unitPrice: number;
    unitPriceDiscount: number;
    lineTotal: number;
  }