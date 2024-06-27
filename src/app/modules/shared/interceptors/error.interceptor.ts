import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { apiUrl } from '@environment/environment';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly toastrService: ToastrService,
    private readonly injector: Injector
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error.message || error.message;
        if ([403].includes(error.status)) {
          let apiRequested = request.url.replace(apiUrl+"/", "").trim().split("/")
          const translateService = this.injector.get(TranslateService)
          this.toastrService.warning("You are not able to manage "+translateService.instant(apiRequested[0].toUpperCase()+".SEARCH.TITLE"), 'Error');
        }
        else {
        this.toastrService.error(errorMessage, 'Error');
        }
        return throwError(() => errorMessage);
      })
    );
  }
}
