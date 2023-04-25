import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { EMPTY, Observable } from 'rxjs';
import {
  catchError,
  delay,
  finalize,
  map,
  retryWhen,
  take,
} from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingController
      .getTop()
      .then(hasLoading => {
        if (!hasLoading) {
          this.loadingController
            .create({
              message: 'Cargando...',
              translucent: true
            })
            .then(loading => loading.present());
        } else {
          console.log(hasLoading);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return next.handle(request).pipe(
      retryWhen((err) => {
        let retries = 1;
        return err.pipe(
          delay(1000),
          take(3),
          map((error) => {
            if (retries++ === 3) {
              throw error;
            }
            return error;
          })
        );
      }),
      catchError((err: HttpErrorResponse) => {
        console.log({ err });
        this.presentFailedAlert(err.error.errorMessage);
        return EMPTY;
      }),
      finalize(() => {
        this.loadingController.getTop().then((hasLoading) => {
          console.log(hasLoading);
          if (hasLoading) {
            this.loadingController.dismiss();
          }
        });
      })
    );
  }

  async presentFailedAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Algo no ha ido bien',
      message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }
}
