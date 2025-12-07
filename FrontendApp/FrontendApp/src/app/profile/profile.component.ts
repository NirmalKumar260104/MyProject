import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { NotificationService } from '../services/notification.service';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderDate: string;
  paymentMethod: string;
  status: string;
  address: string;
  orderItems: OrderItem[];
}

interface UserInfo {
  success: boolean;
  name: string;
  email: string;
  address: string;
  pincode: string;
  mobile: string;
}

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  isLoggedIn = false;
  userInfo: UserInfo | null = null;
  orders: Order[] = [];

  constructor(private authService: AuthService,
    private notification : NotificationService, private http: HttpClient) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    if (!this.authService.isAuthenticated()) {      
      this.notification.ShowMessage("You need to log in to view your profile!","good",3000);
      // alert("You need to log in to view your profile!");
      return;
    }

    this.fetchUserInfo();
    this.fetchUserOrders();
  }

  private fetchUserInfo() {
    const apiUrl = `http://localhost:5156/api/Account/address`;
    const token = this.authService.getToken(); // ✅ Retrieve JWT token

    this.http.get<UserInfo>(apiUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}, // ✅ Attach token
      withCredentials: true
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.userInfo = response;
        } else {
      this.notification.ShowMessage("User details not found.","good",3000);

          // alert("User details not found.");
        }
      },
      error: (error) => {
        console.error("Error fetching user info:", error);
      this.notification.ShowMessage("Failed to load user details.","good",3000);

        // alert("Failed to load user details.");
      }
    });
  }

  private fetchUserOrders() {
    const apiUrl = `http://localhost:5156/api/Order/userorders`;
    const token = this.authService.getToken(); // ✅ Retrieve JWT token

    this.http.get<{ success: boolean; orders: any }>(apiUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}, // ✅ Attach token
      withCredentials: true
    }).subscribe({
      next: (response) => {
        console.log("Order response:", response);

        if (response.success && response.orders && Array.isArray(response.orders)) { 
          this.orders = response.orders; 
          console.log("Orders successfully assigned:", this.orders);
        } else {
          console.error("No orders found.");
        }
      },
      error: (error) => {
        console.error("Error fetching user orders:", error);
        this.notification.ShowMessage("Failed to retrieve order history.","good",3000);

        // alert("Failed to retrieve order history.");
      }
    });
  }
}
