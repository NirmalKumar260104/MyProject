import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-order-confirm',
  imports: [HeaderComponent,RouterLink],
  templateUrl: './order-confirm.component.html',
  styleUrl: './order-confirm.component.css'
})
export class OrderConfirmComponent {
  orderData: any ;
  constructor(private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit() {
      this.route.queryParams.subscribe(params => {
      this.orderData = params['orderData'] ? JSON.parse(params['orderData']) : null;
      console.log("Received Order Data:", this.orderData);
    });
      history.pushState(null, '', location.href);
      window.onpopstate = () => history.pushState(null, '', location.href);
  }
  gotoHome()
  {
    this.router.navigate(['/']);
  }
}
