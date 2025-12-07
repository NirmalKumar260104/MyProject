import { Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule,RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  AllProducts : any = [];
  confirmationstatus : boolean = false;


  constructor( private adminservice : AdminService,
    private notification : NotificationService,
    private authservice: AuthService,
    private http: HttpClient,
    private router : Router)
  {
  }
  ngOnInit()
  {
    this.GetAllProducts();
  }

  GetAllProducts(){
    this.adminservice.GetAllProductsForAdmin().subscribe({
      next: (data)=>{
        console.log("Fetched Products", data);
        this.AllProducts = data;
      },
      error: (error) =>{
        console.error("Error fetching products:", error);
        this.notification.ShowMessage("Failed to load products.", "warn", 3000);
      } 
  });
  }

  deleteProduct(productId: number) {
    const confirmed = confirm("Are you sure you want to delete this category?");
    if(!confirmed) return;
        const token = this.authservice.getToken();
        this.http.delete(`http://localhost:5156/api/Product/${productId}`,{
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }).subscribe({
          next: () => {
                this.notification.ShowMessage("Product deleted successfully!", "delete", 3000);
                this.GetAllProducts();
            },
            error:(error) => {
                console.error("Error deleting product:", error);
                this.notification.ShowMessage("Failed to delete product. Please try again.", "warn", 3000);
            }
    });
    }
  }




  