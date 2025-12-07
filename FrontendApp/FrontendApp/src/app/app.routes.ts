import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { ProfileComponent } from './profile/profile.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ProductdetailComponent } from './productdetail/productdetail.component';
export const routes: Routes = [
    { path: '', component: HomeComponent }, 
    {path: 'register', component: RegisterComponent},
    {path: 'category/:id', component: ProductComponent},
    { path: 'product/:id', component: ProductdetailComponent },
    {path: 'login', component: LoginComponent}, 
    {path: 'cart', component: CartComponent},
    {path: 'order', component: OrderComponent},
    {path: 'profile', component: ProfileComponent},
    // {path: 'product_detail',component:ProductdetailComponent},
    // { path: '**', redirectTo: '' } 
];
