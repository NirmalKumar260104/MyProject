import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-product',
  imports: [CommonModule, HeaderComponent,RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  SpecificProducts: any;
  filterproduct: any[] = [];
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService, 
    private authService: AuthService, 
    private router: Router,
    private notification : NotificationService
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
    }
    const categoryId = Number(this.route.snapshot.params['id']);
    this.productService.getProductByCategoryId(categoryId).subscribe({
      next: (data) => {
        console.log('Received Product Data:', data);
        this.SpecificProducts= data;
      },
      error: (error) => console.error('Error fetching product:', error),
    });
  }

  addToCart(productId: number) {
    if (!this.authService.isAuthenticated()) {
      this.notification.ShowMessage("You need to log in before adding items to the cart.","notify",3000);

      // alert("You need to log in before adding items to the cart.");
      this.router.navigate(['/login']);
      return;
    }
  
    const cartItem = { productId, quantity: 1 }; 
  
    this.authService.addToCart(cartItem).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        // alert("Item added to cart successfully!");
        this.notification.ShowMessage("Item added to cart successfully","good",20000);
      },
      error: (error) => {
        console.error('Failed to add to cart:', error);
        this.notification.ShowMessage("failed to add product","warn",3000)
      }
    });
  }
}
