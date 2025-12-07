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
  imports: [CommonModule, FormsModule, HeaderComponent,RouterLink],
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
      register()
      {
        this.authService.register(this.Fullname, this.Address, this.email, this.password, this.Pincode, this.PhoneNumber).subscribe(
          response =>{
            console.log('Register success', response);
      this.notification.ShowMessage("Registration Successful","good",3000);

            // alert('Registration Successful');
            this.route.navigate(['/login']);
          },
          error =>{
            console.error('Registration failed', error);
            this.notification.ShowMessage("Registration failed","good",3000);

            // alert('Registration failed');
          }
        );
      }
      navigateToLogin(){
        this.route.navigate(["/login"]);
      }
}
