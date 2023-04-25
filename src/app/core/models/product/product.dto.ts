export class ProductDto {
  uuid?: string;
  name: string;
  reference: string;
  price: number;
  decimal: number;
  description: string;
  qty: number;
  commerce?: string;
}
