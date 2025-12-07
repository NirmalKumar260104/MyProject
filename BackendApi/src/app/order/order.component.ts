import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  selectedItems: OrderItem[];
  totalPrice: number;
}

@Component({
  selector: 'app-order',
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  orderData: OrderData = { selectedItems: [], totalPrice: 0 };
  isLoggedIn: boolean = false;
  address: string = '';
  pincode: string = '';
  paymentMethod: string = '';
  //errorMessages = { address: '', pincode: '', paymentMethod: '' };

  constructor(private router: Router, private http: HttpClient, 
    private notification : NotificationService, private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
    }
    else{
      this.notification.ShowMessage("You need to log in to place an order!","notify",3000);
      // alert("You need to log in to place an order!");
      this.router.navigate(['/login']);
      return;
    }
    this.orderData = history.state?.orderData ;
    console.log("Received Order Data:", this.orderData);
    if (!this.orderData) {
      this.notification.ShowMessage("No items selected. Redirecting to cart.","info",3000);
      // alert("No items selected. Redirecting to cart.");
      this.router.navigate(['/cart']);
      return;
    }
     this.loadUserAddress();
  }

  loadUserAddress() {
    const apiUrl = `http://localhost:5156/api/Account/address`;
    const token = this.authService.getToken(); 
    return this.http.get<{ success: boolean; address: string; pincode: string }>(apiUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.address = response.address;
          this.pincode = response.pincode;
        } else {
          // alert("User address not found. Please update your profile.");
        this.notification.ShowMessage("User address not found. Please update your profile.","notify",3000);
        }
      },
      error: (error) => {
        console.error("Failed to load address:", error);
        this.notification.ShowMessage("User address retrieval failed.","info",3000);
        // alert("User address retrieval failed.");
      }
    });
  }
  
  

  placeOrder() {
    const pincodePattern = /^[1-9][0-9]{5}$/;
  
    if (!this.address.trim()) {
      this.notification.ShowMessage("Address is required.",'notify',3000);
      return;
    }
    if (!this.pincode.trim() && !pincodePattern.test(this.pincode)) {
      this.notification.ShowMessage("Pincode is required.",'notify',3000);
      return;
    }
    if (!this.paymentMethod.trim()) {
      this.notification.ShowMessage("Please select a payment method.",'notify',3000);
      return;
    }
  
    const token = this.authService.getToken(); 
  
    const orderPayload = {
      address: this.address,
      pincode: this.pincode,
      totalPrice: this.orderData.totalPrice,
      paymentMethod: this.paymentMethod,
      orderItems: this.orderData.selectedItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    };
  
    console.log("Order payload:", orderPayload);
  
    this.http.post("http://localhost:5156/api/Order/createorder", orderPayload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}, // Attach JWT token
      withCredentials: true
    }).subscribe({
      next: () => {
        // alert("Your order has been placed!");
        this.notification.ShowMessage("Your order has been placed!","good",3000);

        this.orderData.selectedItems = [];
        this.router.navigate(['/orderconfirm'], {
          queryParams: {orderData: JSON.stringify(orderPayload)}
        });
      },
      error: (error) => {
        console.error("Order placement failed:", error);
        this.notification.ShowMessage(`Failed to place order: ${error.error?.message}`,"notify",3000);
        // alert(`Failed to place order: ${error.error?.message}`);
      }
    });
  }

  cancelandredirect(){
    this.orderData.selectedItems = [];
    this.router.navigateByUrl('cart')
  }
  
}
