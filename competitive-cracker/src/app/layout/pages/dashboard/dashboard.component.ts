import { Component } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  courses: any[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  perPage = 8;
  filterForm!: FormGroup;

  constructor(
    private dashbordService: DashboardService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadCourses();
      });

    this.loadCourses();
  }

  initializeForm() {
    this.filterForm = new FormGroup({
      search: new FormControl(''),
      category: new FormControl(''),
      sort: new FormControl('new'),
    });
  }

  loadCourses() {
    this.loading = true;
    const { search, category, sort } = this.filterForm.value;

    this.dashbordService
      .getCourses(this.currentPage, this.perPage, search, category, sort)
      .subscribe({
        next: (response: any) => {
          this.courses = response.data;
          this.currentPage = response.current_page;
          this.totalPages = response.last_page;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading courses:', error);
          this.loading = false;
        },
      });
  }

  changePage(page: number) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.loadCourses();
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  logout() {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      this.authService.logout();
    }
  }

  sanitace(description: string) {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }
}
