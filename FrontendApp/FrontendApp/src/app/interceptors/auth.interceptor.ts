import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken(); // ✅ Retrieve JWT token

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` } // ✅ Automatically attach JWT token
      });
    } else {
      console.warn("Missing JWT Token in request.");
    }

    return next.handle(req);
  }
}
