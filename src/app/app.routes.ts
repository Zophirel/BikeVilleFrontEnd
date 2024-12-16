import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { SignalRComponent } from './signalr/signalr.component';
import { AccountComponent } from './account/account/account.component';
import { FaqsComponent } from './account/faqs/faqs.component';
import { AboutComponent } from './account/about/about.component';
import { CartComponent } from './cart/cart.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductComponent } from './product/product.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'account', component: AccountComponent},
    {path: 'about', component: AboutComponent},
    {path: 'faq', component: FaqsComponent},
    {path: 'cart', component: CartComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'privacy', component: PrivacypolicyComponent},
    {path: 'search', component: SearchComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'forgot-password', component: ForgotPassComponent},
    {path: 'signalr', component: SignalRComponent},
    {path: 'product', component: ProductComponent},
];
