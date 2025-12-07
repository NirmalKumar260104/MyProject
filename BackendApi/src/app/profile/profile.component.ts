import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { NotificationService } from '../services/notification.service';
import { Router, RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [HeaderComponent, CommonModule,RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  isLoggedIn = false;
  userInfo :any = [];

  constructor(private authService: AuthService,
    private notification : NotificationService, 
    private router : Router,
    private http: HttpClient) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {      
      this.isLoggedIn = true;
      // alert("You need to log in to view your profile!");
    }
    else{
      this.notification.ShowMessage("You need to log in to view your profile!","notify",3000);
      return;
    }

    this.fetchUserInfo();
  }

  fetchUserInfo() {
    const apiUrl = `http://localhost:5156/api/Account/address`;
    const token = this.authService.getToken(); 
 
    this.http.get(apiUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    }).subscribe({
      next: (response :any) => {
        if (response.success) {
          this.userInfo = response;
        } 
        else {
          this.notification.ShowMessage("User details not found.","notify",3000);
          // alert("User details not found.");
        }
      },
      error: (error) => {
        console.error("Error fetching user info:", error);
        this.notification.ShowMessage("Failed to load user details.","warn",3000);
        // alert("Failed to load user details.");
      }
    });
  }

  navigateToEditPage(){
    this.router.navigate(['/profileedit'],{
      queryParams : {
        userdetails : JSON.stringify(this.userInfo)
      }
    })
  }
}
