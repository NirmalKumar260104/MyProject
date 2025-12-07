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

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    try {
      this.product = await this.productService.GetProductDetailsById(id);
      console.log("product from GetProductDetailsById : ",this.product);
      this.displayRecommendedProducts(this.product.categoryId);
      this.router.events.subscribe(event => {
        console.log('Navigation Event:', event);
      });
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
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

  async displayRecommendedProducts(catid : number){
    try{
      var productofthatcategory = await this.productService.getproductsByCategoryId(catid);
      console.log("productofthatcategory : ",productofthatcategory);
      this.recommendedProducts = productofthatcategory;
      this.recommendedProducts.forEach((pro : any) => {
        console.log(pro.name);
      })
      console.log("recommended products ", productofthatcategory);
    }catch(error){
      console.error("Error fetching recommended products:", error);    
    }
  }

  goToProduct(prod_id : number){
      // console.log("Clicked Product ID:", prod_id);
      // console.log("Navigating to:", `/product/${prod_id}`);
      this.router.navigate(['/product', prod_id]);

  }
}
