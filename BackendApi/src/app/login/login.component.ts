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
  imports: [CommonModule, FormsModule,RouterLink, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    email = '';
    password = '';
    constructor(private authService: AuthService,
                private router: Router,
                private notification : NotificationService){}
    login() {
      if(!this.email)
      {
        this.notification.ShowMessage("Please enter email","warn",3000);
        return;
      }
      else if(!this.password)
      {
        this.notification.ShowMessage("Please enter password","warn",3000);
        return;
      }
      this.authService.login(this.email, this.password).subscribe(
        response => {
          console.log('Login successful:', response);
          this.notification.ShowMessage("Login Successful !","good",3000);
          console.log("role of user : " , response.role);
          if(response.role == "Admin")
          {
              sessionStorage.setItem("Role",response.role);
          };
          this.router.navigate(['']);
        },
        error => {
          console.error('Login failed:', error);
          this.notification.ShowMessage("Invalid credentials, try again !","notify",3000);
        }
      );
    }
    navigateToRegister()
    {
       this.router.navigate(['/register']);
    }
}