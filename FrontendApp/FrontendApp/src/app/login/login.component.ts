import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../services/notification.service';
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    email = '';
    password = '';
    constructor(private authService: AuthService, 
      private router: Router,
      private notification : NotificationService)
    {}
    login() {
      this.authService.login(this.email, this.password).subscribe(
        response => {
          console.log('Login successful:', response);
          this.notification.ShowMessage("Login Successful !","good",3000);
          // alert('Login Successful! Redirecting...');
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Login failed:', error);
          this.notification.ShowMessage("Invalid credentials, try again !","good",3000);
          // alert('Invalid credentials. Try again.');
        }
      );
    }
    navigateToRegister()
    {
       this.router.navigate(['/register']);
    }
}
