import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { ProfileComponent } from './profile/profile.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { OverviewComponent } from './Admin/dashboard/overview/overview.component';
import { ProductsComponent } from './Admin/dashboard/products/products.component';
import { OrdersComponent } from './Admin/dashboard/orders/orders.component';
import { UsersComponent } from './Admin/dashboard/users/users.component';
import { CategoriesComponent } from './Admin/dashboard/categories/categories.component';
import { AddProductComponent } from './Admin/dashboard/add-product/add-product.component';
import { AddCategoryComponent } from './Admin/dashboard/add-category/add-category.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderConfirmComponent } from './order-confirm/order-confirm.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { authGuardGuard } from './Admin/auth-guard.guard';
export const routes: Routes = [
    {path: '', component: HomeComponent }, 
    {path: 'register', component: RegisterComponent},
    {path: 'category/:id', component: ProductComponent},
    {path: 'product/:id', component: ProductdetailComponent },
    {path: 'login', component: LoginComponent}, 
    {path: 'cart', component: CartComponent},
    {path: 'orderhistory', component: OrderHistoryComponent},
    {path:'orderconfirm',component:OrderConfirmComponent},
    {path: 'order', component: OrderComponent},
    {path: 'profile', component: ProfileComponent},
    {path : 'profileedit', component:ProfileEditComponent},
    {path : 'admin', component:DashboardComponent, 
        canActivate:[authGuardGuard],
    children:[
        {
            path:'home',
            component: OverviewComponent
        },
        {
            path:'Products',
            component:ProductsComponent
        },
        {
            path:'Orders',
            component: OrdersComponent
        },
        {
            path:'Users',
            component:UsersComponent
        },
        {
            path:'Categories',
            component:CategoriesComponent
        },
        {
            path: 'addproduct',
            component:AddProductComponent
        },
        {
            path:'editproduct/:id',
            component:AddProductComponent
        },
        {
            path: 'addcategory',
            component:AddCategoryComponent
        },
        {
            path:'editcategory/:id',
            component:AddCategoryComponent
        },
        {
            path:'',
            redirectTo:'home',
            pathMatch:'full'
        }
    ]},
];
