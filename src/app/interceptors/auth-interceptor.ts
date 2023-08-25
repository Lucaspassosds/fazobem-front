import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return from(
      this.requestRequiresToken(req)
        ? this.authService.getAccessToken().then((token) => {
            if (token) {
              req = req.clone({
                setHeaders: {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  Authorization: 'Bearer ' + token,
                },
              });
            }
          })
        : Promise.resolve(),
    ).pipe(mergeMap(() => next.handle(req)));
  }

  private requestRequiresToken(req: HttpRequest<any>): boolean {
    return (
      !/\/login$/.test(req.url) &&
      !/\/register$/.test(req.url) &&
      !/\/request-change-password$/.test(req.url) &&
      !/\/change-password$/.test(req.url)
    );
  }
}
