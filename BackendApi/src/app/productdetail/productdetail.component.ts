import { Component, OnInit ,} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-productdetail',
  imports: [HeaderComponent,CommonModule,RouterLink],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.css'
})
export class ProductdetailComponent implements OnInit {

  product: any;
  recommendedProducts : any = [];

  constructor(private route: ActivatedRoute,
    private authService : AuthService,
    private router : Router,
    private notification : NotificationService,
     private productService: ProductService) {}

     ngOnInit() {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.router.routeReuseStrategy.shouldReuseRoute = () => false; // Forces angular to reload the component
    
      this.productService.GetProductDetailsById(id).subscribe({
        next: (product) => {
          this.product = product;
          console.log("Product from GetProductDetailsById:", this.product);
          this.displayRecommendedProducts(this.product.categoryId);
        },
        error: (error) => {
          console.error("Error fetching product details:", error);
        }
      });
    }
  addToCart(productId:number) {
    const cartItem = { 
      productId: productId, 
      quantity: 1 
    };
    this.authService.addToCart(cartItem).subscribe({
      next: (response) => {
        console.log("Product added successfully!", response)
        this.notification.ShowMessage("Item Added to cart","good",3000)
      },
      error: (error) => console.error("Error adding product to cart:", error)
    });
  }
  displayRecommendedProducts(categoryId : number)
  {
    this.productService.getProductByCategoryId(categoryId).subscribe({
      next: (data) => {
        console.log('Received Product Data:', data);
        this.recommendedProducts= data;
      },
      error: (error) =>{ 
        console.error('Error fetching product:', error);
        this.notification.ShowMessage(`Error fetching recommended products: ${error}`,"notify",3000);
      }
    });
  }

  goToProduct(prod_id : number){
      this.router.navigate(['/product', prod_id]);
  }
}
