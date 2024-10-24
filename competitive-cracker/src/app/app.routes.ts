import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './layout/pages/dashboard/dashboard.component';
import { authGuard } from './auth/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegistrationComponent },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [{ path: '', component: DashboardComponent, pathMatch: 'full' }],
  },
  { path: '**', redirectTo: '' },
];
