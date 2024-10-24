import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastrService);

  const skippedUrls = ['auth/login', 'auth/register'];

  if (isUrlSkipped(req.url, skippedUrls)) {
    return next(req);
  }

  const authReq = addToken(req);

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        toast.error('Invalid access');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );

  function addToken(req: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = localStorage.getItem('access_token');
    if (token) {
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return req;
  }
  function isUrlSkipped(requestUrl: string, skippedUrls: string[]): boolean {
    return skippedUrls.some((url) => requestUrl.includes(url));
  }
  return next(req);
};
