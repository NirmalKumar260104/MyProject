import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { NotificationService } from '../../../services/notification.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  AllCategories: any[] = [];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private notification: NotificationService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.GetAllCategories();
  }

  GetAllCategories() {
    this.adminService.GetAllCategoriesforAdmin().subscribe({
      next: (data) => {
        console.log("Fetched Categories", data);
        this.AllCategories = data;
      },
      error: (error) => {
        console.error("Error fetching categories:", error);
        this.notification.ShowMessage("Failed to load categories.", "warn", 3000);
      }
    });
  }

  deleteCategory(categoryId: number) {
    const confirmed = confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;
    const token = this.authService.getToken();
    this.http.delete(`http://localhost:5156/api/Categories/${categoryId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    }).subscribe({
      next: () => {
        this.notification.ShowMessage("Category deleted successfully!", "delete", 3000);
        this.GetAllCategories();
      },
      error: (error) => {
        console.error("Error deleting category:", error);
        this.notification.ShowMessage("Failed to delete category. Please try again.", "warn", 3000);
      }
    });
  }
}
