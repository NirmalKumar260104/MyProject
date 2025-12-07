import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderComponent } from '../order/order.component';
import {tap, catchError, throwError} from 'rxjs';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-cart',
  imports: [HeaderComponent, CommonModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  selectedItems: Set<number> = new Set();
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService,
     private http: HttpClient,
      private router: Router ,

    private notification : NotificationService) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.notification.ShowMessage("You need to log in to view your cart!","notify",3000);
      // alert("You need to log in to view your cart!");
      this.router.navigate(['/login']);
      return;
    }
    else{
      this.isLoggedIn = true;
    }

    this.loadCart();
  }

  loadCart() {
    const apiUrl = 'http://localhost:5156/api/Cart'; 
    const token = this.authService.getToken(); 
  
    return this.http.get<any[]>(apiUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}, 
      withCredentials: true
    }).subscribe({next:(items)=>{
      this.cartItems =items || [];
      console.log("Loaded cart ",this.cartItems);
    },
    error:(error)=>{
      console.error("Cart API Error", error);
      this.notification.ShowMessage("Failed to add Categoey","warn",3000);
    }
  });
  }
  
  
  increaseQuantity(cartItemId: number) {
    const item = this.cartItems.find(ci => ci.id === cartItemId);
    if (item) {
      item.quantity += 1;
      item.total = item.quantity * item.price; 
      this.updateQuantity(cartItemId, item.quantity);
    }
  }
  decreaseQuantity(cartItemId: number) {
    const item = this.cartItems.find(ci => ci.id === cartItemId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      item.total = item.quantity * item.price; 
      this.updateQuantity(cartItemId, item.quantity);
    }
  }
  gettotalPrice(): number {
    return this.cartItems.reduce((total, item) => 
      this.selectedItems.has(item.id) ? total + item.quantity * item.price : total, 0);
  }
  toggleSelection(cartItemId: number) {
    this.selectedItems.has(cartItemId) ? this.selectedItems.delete(cartItemId) : this.selectedItems.add(cartItemId);
  }

  updateQuantity(cartItemId: number, newQuantity: number) {
    const token = this.authService.getToken();
    const apiUrl = `http://localhost:5156/api/Cart/${cartItemId}/quantity?quantity=${newQuantity}`;
    const item = this.cartItems.find(i => i.id === cartItemId);
    this.http.put(apiUrl,{}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}, 
      withCredentials: true
    }).subscribe({
      next: () => {
        if (item) {
          item.quantity = newQuantity;
          item.total = item.quantity * item.price;
        }
      },
      error: (error) => {
        console.error("API Error:", error);
        this.notification.ShowMessage("Out of Stock","warn",3000);
        item.quantity = newQuantity -1;
        item.total = item.quantity * item.price;
        // alert("Failed to update quantity.");
      }
    });
  }

  removeItem(cartItemId: number) {
    const apiUrl = `http://localhost:5156/api/Cart/${cartItemId}`;
    
    this.http.delete(apiUrl).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
      },
      error: (error) => {
        console.error("Failed to remove item:", error);
        // alert("Failed to remove item.");
      this.notification.ShowMessage("Failed to remove item.","warn",3000);

      }
    });
  }

  BuyNow() {
    if (this.selectedItems.size === 0) {
      this.notification.ShowMessage("Please select at least one item.","notify",3000);
      // alert("Please select at least one item.");
      return;
    }

    const orderData = {
      selectedItems: this.cartItems.filter(item => this.selectedItems.has(item.id)),
      totalPrice: this.gettotalPrice()
    };
    console.log("Sending to Order", orderData);
    this.router.navigate(['order'], { state: { orderData } });
  }
}
