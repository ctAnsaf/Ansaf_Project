import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  registraionForm!: FormGroup;
  is_submited: boolean = false;
  subscription: Subscription[] = [];

  constructor(
    private apiService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registraionForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      device: new FormControl(),
      user_type: new FormControl('student'),
      social_auth: new FormControl(1),
    });
  }

  onSubmit(): void {
    this.is_submited = true;
    if (this.registraionForm.valid) {
      const apiCall = this.apiService
        .register(this.registraionForm.value)
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res?.status) {
              this.toastr.success('Successfully Registered');
              this.router.navigate(['/auth/login']);
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
