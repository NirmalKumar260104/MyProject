import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { NotificationService } from '../services/notification.service';
@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule,RouterLink, HeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
      Fullname = '';
      Address ='';
      email = '';
      password = '';
      Pincode = '';
      PhoneNumber = '';
      constructor(private authService: AuthService,
        private notification : NotificationService, private route: Router)
      {
      }
      get isValidPassword(): boolean { return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@#$%^&*!]).{6,}$/.test(this.password);
      }
      get isValidPincode(): boolean {
        return /^[1-9][0-9]{5}$/.test(this.Pincode);
      }
      get isValidPhoneNumber(): boolean {
        return /^[6-9][0-9]{9}$/.test(this.PhoneNumber);
      }
      register()
      {
        if (!this.isValidPassword || !this.isValidPincode || !this.isValidPhoneNumber || !this.Address || !this.Fullname || !this.email) {
          this.notification.ShowMessage("All fields are required", "warn", 3000);
          return;
        }
        this.authService.register(this.Fullname, this.Address, this.email, this.password, this.Pincode, this.PhoneNumber).subscribe(
          response =>{
            console.log('Register success', response);
      this.notification.ShowMessage("Registration Successful","good",3000);
 
           
            this.route.navigate(['/login']);
          },
          error =>{
            console.error('Registration failed', error);
            this.notification.ShowMessage(`Registration failed ${error.message}`,"notify",3000);
          }
        );
      }
      navigateToLogin(){
        this.route.navigate(["/login"]);
      }
}