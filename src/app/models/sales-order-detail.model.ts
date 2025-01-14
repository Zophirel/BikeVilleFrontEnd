export interface SalesOrderDetail {
    salesOrderId: number;
    salesOrderDetailId: number;
    orderQty: number;
    productId: number;
    unitPrice: number;
    unitPriceDiscount: number;
    lineTotal: number;
    rowguid: string;
    modifiedDate: Date;
  }