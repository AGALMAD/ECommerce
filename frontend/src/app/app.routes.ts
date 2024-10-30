import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';
//import { ProductViewComponent } from './pages/product-view/ProductViewComponent';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "login", component: LoginComponent},
    {path: "user", component: UserComponent},
    {path: "about-us", component: AboutUsComponent},
    {path: "product-view", component: ProductViewComponent}
];
