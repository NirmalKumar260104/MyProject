import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule,HeaderComponent,RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {
  orders: any = [];

  constructor(private http: HttpClient,
    private authService:AuthService,
    private notification : NotificationService
  ){}
  ngOnInit(){
    this.fetchUserOrders();
  }

  private fetchUserOrders() {
    const apiUrl = `http://localhost:5156/api/Order/userorders`;
    const token = this.authService.getToken();

    this.http.get<{ success: boolean; orders: any }>(apiUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}, 
      withCredentials: true
    }).subscribe({
      next: (response) => {
        console.log("Order response:", response);

        if (response.success && response.orders) { 
          this.orders = response.orders; 
          console.log("Orders successfully assigned:", this.orders);
        } else {
          console.error("No orders found.");
        }
      },
      error: (error) => {
        console.error("Error fetching user orders:", error);
        this.notification.ShowMessage("Failed to retrieve order history.","warn",3000);

        // alert("Failed to retrieve order history.");
      }
    });
  }
}
