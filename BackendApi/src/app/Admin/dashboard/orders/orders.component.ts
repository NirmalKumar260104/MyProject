import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule,FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  AllOrders: any[] = [];
  selectedOrderId: number | null = null;
  selectedStatus: string = 'Pending';
  showPopup: boolean = false;

  constructor(private authservice: AuthService, private http: HttpClient, private notification:NotificationService) {}

  ngOnInit() {
    this.FetchAllOrders();
  }

  FetchAllOrders() {
    const token = this.authservice.getToken();
    const fetchAllOrdersUrl = 'http://localhost:5156/api/Order/GetAllOrders';

    this.http.get(fetchAllOrdersUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    }).subscribe((data: any) => {
      console.log("Orders data:", data);
      this.AllOrders = data;
    });
  }

  OpenStatusChangePopup(orderId: number) {
    this.selectedOrderId = orderId;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.selectedOrderId = null;
  }

  updateStatus() {
    if (!this.selectedOrderId) return;
    const token = this.authservice.getToken();
    const updateUrl = `http://localhost:5156/api/Order/UpdateOrderStatus/${this.selectedOrderId}?orderStatus=${this.selectedStatus}`;

    this.http.patch(updateUrl, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    }).subscribe(() => {
      console.log("Order status updated:", this.selectedStatus);
      this.notification.ShowMessage("Updated Successful.", "good", 3000);
      this.closePopup();
      this.FetchAllOrders(); 
    },
    (error)=>{
      this.notification.ShowMessage("Update Failed", "warn", 3000);
      console.log("Updated Failed",error);
    }
  );
  }
}
