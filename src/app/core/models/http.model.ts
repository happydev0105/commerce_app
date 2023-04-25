import { HttpStatusCode } from "@angular/common/http";

export interface SuccessHttpResponse {
  status: HttpStatusCode;
  message: string;
}

export interface YeasyHttpResponse {
  responseMessage: string;
}
