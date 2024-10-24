import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  is_submited: boolean = false;
  subscription: Subscription[] = [];
  constructor(
    private toastr: ToastrService,
    private api: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      device: new FormControl('', Validators.required),
      social_auth: new FormControl(1),
    });
  }

  onSubmit(): void {
    this.is_submited = true;
    if (this.loginForm.valid) {
      const apiCall = this.api.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res?.status) {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {},
      });
      this.subscription.push(apiCall);
    } else {
      this.toastr.error('Form not valid!');
    }
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
