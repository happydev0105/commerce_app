import { PaymentService } from "../models/payments-service/payments-service.model";

export interface Top5ServicesReport {
  service: PaymentService;
  totalUnities: number;
  totalAmount: number;
}
