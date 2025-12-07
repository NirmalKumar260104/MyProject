import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl : string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5156/api/categories';
  private productUrl = 'http://localhost:5156/api/Product/GetAllProductsforCustomer';
  // private Productdetailsurl = "http://localhost:5156/api/Product/productdetails";

  constructor(private http: HttpClient) {}

  getCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap(data => console.log('Fetched Categories:', data)),
      catchError(error => {
        console.error('Error fetching categories:', error);
        throw error;
      })
    );
  }

  
  getProductByCategoryId(categoryId: number): Observable<Product> {
    return this.http.get<Product>(`http://localhost:5156/api/Product/GetProductByCategoryId/${categoryId}`).pipe(
      tap(data => console.log('Fetched Product:', data)),
      catchError(error => {
        console.error('Error fetching product:', error);
        throw error;
      })
    );
  }

  
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productUrl).pipe(
      tap(data => console.log('Fetched All Products:', data)),
      catchError(error => {
        console.error('Error fetching all products:', error);
        
        throw error;
      })
    );
  }


  GetProductDetailsById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:5156/api/Product/GetProductByProductId/${id}`).pipe(
      tap(data=> console.log('Fetched Product detail', data)),
      catchError(error => {
        console.log('Error fetching product details',error);
        throw error;
      })
    );
  }

}
