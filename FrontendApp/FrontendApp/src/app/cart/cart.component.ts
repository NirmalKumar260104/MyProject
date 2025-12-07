import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderComponent } from '../order/order.component';
import {tap} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'; 
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
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    if (!this.authService.isAuthenticated()) {
      this.notification.ShowMessage("You need to log in to view your cart!","good",3000);
      // alert("You need to log in to view your cart!");
      this.router.navigate(['/login']);
      return;
    }

    this.loadCart();
  }

  loadCart() {
    const apiUrl = 'http://localhost:5156/api/Cart'; 
    const token = this.authService.getToken(); 
  
    return this.http.get<any[]>(apiUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}, 
      withCredentials: true
    }).pipe(
      tap(items => {
        this.cartItems = items || [];
        console.log("Loaded cart items:", this.cartItems);
      }),
      catchError(error => {
        console.error("Cart API Error:", error);
      this.notification.ShowMessage("Failed to fetch cart. Please try again.","good",3000);

        // alert("Failed to fetch cart. Please try again.");
        return throwError(() => error);
      })
    ).subscribe();
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
    return this.cartItems.reduce((total, item) => {
      return this.selectedItems.has(item.id) ? total + item.quantity * item.price : total;
    }, 0);
  }

  toggleSelection(cartItemId: number) {
    this.selectedItems.has(cartItemId) ? this.selectedItems.delete(cartItemId) : this.selectedItems.add(cartItemId);
  }

  updateQuantity(cartItemId: number, newQuantity: number) {
    const apiUrl = `http://localhost:5156/api/Cart/${cartItemId}/quantity?quantity=${newQuantity}`;

    this.http.put(apiUrl, {}).subscribe({
      next: () => {
        const item = this.cartItems.find(i => i.id === cartItemId);
        if (item) {
          item.quantity = newQuantity;
          item.total = item.quantity * item.price;
        }
      },
      error: (error) => {
        console.error("API Error:", error);
        this.notification.ShowMessage("Failed to update quantity.","good",3000);

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
      this.notification.ShowMessage("Failed to remove item.","good",3000);

      }
    });
  }

  BuyNow() {
    if (this.selectedItems.size === 0) {
      this.notification.ShowMessage("Please select at least one item.","good",3000);

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
