import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent  implements OnInit{

  buttontitle = 'Add';
  AllCategories : any[] = [];
  NewProduct = {
      id: 0,
      name: '',
      description:'' ,
      price: 0,
      stock: 0,
      brand: '',
      imageUrl: '',
      categoryId: 0
  };

  constructor(private adminservice : AdminService,
              private http :HttpClient,
              private router : Router,
              private notification: NotificationService,
              private authservice : AuthService,
              private route : ActivatedRoute){};
  
ngOnInit() {
  this.adminservice.GetAllCategoriesforAdmin().subscribe(data =>{
    this.AllCategories =data;
  });
    const productId = this.route.snapshot.paramMap.get("id");
    if (productId) {
        
        this.adminservice.GetProductDetailsById(productId).subscribe(
          (prod: any) => {
              this.buttontitle = 'Update';
              this.NewProduct = {
              id: prod.id ?? this.NewProduct.id,
              name: prod.name ?? this.NewProduct.name,
              description: prod.description ?? this.NewProduct.description,
              price: prod.price ?? this.NewProduct.price,
              stock: prod.stock ?? this.NewProduct.stock,
              brand: prod.brand ?? this.NewProduct.brand,
              imageUrl: prod.imageUrl ?? this.NewProduct.imageUrl,
              categoryId: prod.categoryId ?? this.NewProduct.categoryId
              };
              },
          (error) => console.error("Error fetching product details:", error));
        }
    }
    validateProduct(): boolean {
      if (!this.NewProduct.name.trim() || !this.NewProduct.description.trim() ||
        this.NewProduct.price <= 0 || this.NewProduct.stock < 0 ||
        !this.NewProduct.brand.trim() || this.NewProduct.categoryId <= 0) {
        this.notification.ShowMessage("All fields except image must be filled correctly!", "warn", 3000);
        return false;
      }
      return true;
    }
    AddOrUpdateProduct() {
      if (!this.validateProduct()) return;
  
      const token = this.authservice.getToken();
      const formData = new FormData();
      formData.append('name', this.NewProduct.name);
      formData.append('description', this.NewProduct.description);
      formData.append('price', this.NewProduct.price.toString());
      formData.append('stock', this.NewProduct.stock.toString());
      formData.append('brand', this.NewProduct.brand);
      formData.append('categoryId', this.NewProduct.categoryId.toString());
  
      if (this.NewProduct.imageUrl) {
        formData.append('ImageFile', this.NewProduct.imageUrl);
      }
  
      const apiUrl = this.NewProduct.id ? `http://localhost:5156/api/Product/${this.NewProduct.id}`: 'http://localhost:5156/api/Product';
  
      const requestMethod = this.NewProduct.id ? this.http.put.bind(this.http) : this.http.post.bind(this.http);
  
      requestMethod(apiUrl, formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true
      }).subscribe(
        () => {
          this.notification.ShowMessage(
            this.NewProduct.id ? "Product updated successfully!" : "Product added successfully!","good", 3000);
             this.router.navigate(['/admin/Products']);
        },
        (error) => {
          console.error("Error saving product:", error);
          this.notification.ShowMessage(
            this.NewProduct.id ? "Failed to update product." : "Failed to add product.","warn", 3000);
        }
      );
    }
  onFileSelected(event: any) {
    const file = event.target.files[0]; 
    console.log(file);
    if(file)  this.NewProduct.imageUrl = file;
  }
}
