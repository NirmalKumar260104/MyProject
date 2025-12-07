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
  private productUrl = 'http://localhost:5156/api/Product/GetAllProducts';
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

  
  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`http://localhost:5156/api/Product/GetProductByCategoryId/${productId}`).pipe(
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


  // GetProductDetailsById(id : number){
  //   fetch(`http://localhost:5156/api/Product/productdetails/${id}`).then(response => response.json()).then(data => {
  //     console.log(`Data of product details : ${data}`)
  //     return data;
  //   }).catch(error => console.log("error :", error));
  // }

  GetProductDetailsById(id: number): Promise<any> {
    return fetch(`http://localhost:5156/api/Product/GetProductByProductId/${id}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        // console.log(`Data of product details:`, data);
        return data;
      })
      .catch(error => {
        console.error("Error fetching product details:", error);
      });
  };

  getproductsByCategoryId(Cat_id : number): Promise<any> {
    return fetch(`http://localhost:5156/api/Product/GetProductByCategoryId/${Cat_id}`)
    .then(res =>  {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log("fetched category details " ,data);
      return data;
  }).catch(error => 
    {
      console.log(error);
      throw error;
  })
  }
}
