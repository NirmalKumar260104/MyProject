import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent,RouterOutlet,RouterLink,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {}
}
