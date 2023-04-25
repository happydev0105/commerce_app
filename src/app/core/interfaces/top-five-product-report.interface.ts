import { PaymentProduct } from "../models/payments-product/payments-product.model";

export interface Top5ProductsReport {
  product: PaymentProduct;
  totalUnities: number;
  totalAmount: number;
}
