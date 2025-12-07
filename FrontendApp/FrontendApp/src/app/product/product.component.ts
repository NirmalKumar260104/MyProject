import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { Injectable } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-product',
  imports: [CommonModule, HeaderComponent,RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  SpecificProducts: any;
  filterproduct: any[] = [];
  searchquery = '';
  cart: { [key: number]: number } = {};
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService, 
    private authService: AuthService, 
    private router: Router,
    private notification : NotificationService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    const productId = Number(this.route.snapshot.params['id']);
    this.productService.getProductById(productId).subscribe({
      next: (data) => {
        console.log('Received Product Data:', data);
        this.SpecificProducts= data;
      },
      error: (error) => console.error('Error fetching product:', error),
    });

    this.productService.getAllProducts().subscribe((data) => {
      this.filterproduct = data;
    });
  }

  addToCart(productId: number) {
    if (!this.authService.isAuthenticated()) {
      this.notification.ShowMessage("You need to log in before adding items to the cart.","good",3000);

      // alert("You need to log in before adding items to the cart.");
      this.router.navigate(['/login']);
      return;
    }
  
    const cartItem = { productId, quantity: 1 }; 
  
    this.authService.addToCart(cartItem).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        // alert("Item added to cart successfully!");
        this.notification.ShowMessage("Item added to cart successfully","good",200000);
      },
      error: (error) => {
        console.error('Failed to add to cart:', error);
        this.notification.ShowMessage("failed to add product","bad",3000)
      }
    });
  }

  // GoToProductDetails(id : number){
  //   this.router.navigateByUrl(`category/${id}`);
  // }
}
