import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ToastService } from "../services/toast/toast.service";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    private toastService: ToastService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((response) => {
        if (response instanceof HttpResponse) {
          if (response.status === 201) {
            if (response.body && response.body.responseMessage) {
              this.toastService.presentToast(response.body.responseMessage, true);
            }
          }
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          const httpStatusType = err.status.toString().charAt(0);
          if (httpStatusType === '4') {
            this.toastService.presentToast(err.error.message, false);
          } else if (err.status === 500) {
            this.toastService.presentToast('Ha ocurrido un error. Por favor inténtalo más tarde', false);
          }
        }
        return of(err);
      })
    );
  }
}
