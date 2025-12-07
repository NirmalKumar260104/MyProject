import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private getproducts_url = "http://localhost:5156/api/Product/GetAllProductsforAdmin";
  private getcategory_url = "http://localhost:5156/api/Categories";
  private getproductbyid_url = "http://localhost:5156/api/Product/GetProductByProductId";
  constructor(private http : HttpClient) { }

  GetAllProductsForAdmin(): Observable<any> {
    return this.http.get(this.getproducts_url);
  };

  GetAllCategoriesforAdmin(): Observable<any[]> {
    return this.http.get<any[]>(this.getcategory_url);
  }
  

  GetCategoryByIdForAdmin(id : any){
    return this.http.get(`${this.getcategory_url}/${id}`);
  }
  
  GetProductDetailsById(id: any){
    return this.http.get(`${this.getproductbyid_url}/${id}`);
  }
}
