// app.config.ts

import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { authInterceptorInterceptor } from './interceptor/auth-interceptor.interceptor';
import { AuthService } from './auth/auth.service';

export function initializeAppFactory(authService: AuthService) {
  return () => authService.initializeApp();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(
      withInterceptors([authInterceptorInterceptor]),
      withInterceptorsFromDi()
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService],
      multi: true,
    },
  ],
};
