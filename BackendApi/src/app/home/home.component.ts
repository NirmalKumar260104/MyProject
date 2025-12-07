import { Component, OnInit } from '@angular/core';
import { ProductService, Category } from '../services/product.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { Router,RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { interval } from 'rxjs';



@Component({
  standalone: true,
  selector: 'app-home',
  imports: [HeaderComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  category: any[] = [];
  allProducts: any[] = [];
  isLoggedIn = false;
  private imageUrls = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.png","6.jpg"];
  private currentIndex = 0;
  private adImage!: HTMLImageElement; // HTMLImageElement | null = null
 
  constructor(
    private notification: NotificationService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
 
    this.fetchCategories();
    this.fetchAllProducts();
    this.initImageLoop();
  }
 
  private fetchCategories(): void {
    this.productService.getCategory().subscribe({
      next: (data) => {
        this.category = data;
        console.log("Received Category Data:", this.category);
      },
      error: (error) => console.error("Error fetching categories:", error),
    });
  }
 
  private fetchAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        console.log("All Products:", this.allProducts);
      },
      error: (error) => console.error("Error fetching products:", error),
    });
  }
 
  private initImageLoop(): void {
    this.adImage = document.getElementById("adImage") as HTMLImageElement;
    if (this.adImage) {
      this.updateImage();
      interval(3000).subscribe(() => this.updateImage());
    }
  }
 
  private updateImage(): void {
    if (this.adImage) {
      this.adImage.src = this.imageUrls[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.imageUrls.length;
    }
  }
 
  viewProducts(CategoryId: number): void {
    this.router.navigate([`/category/${CategoryId}`]);
  }
 
  addToCart(productId: number): void {
    const cartItem = { productId, quantity: 1 };
    
    this.authService.addToCart(cartItem).subscribe({
      next: (response) => {
        console.log("Product added successfully!", response);
        this.notification.ShowMessage("Item Added to cart", "success", 3000);
      },
      error: (error) => {
        console.error("Error adding product to cart:", error);
      },
    });
  }
}