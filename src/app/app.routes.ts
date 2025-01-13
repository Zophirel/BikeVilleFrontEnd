import { animate, animation } from '@angular/animations';
import { Routes } from '@angular/router';
export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), data: {animation: "HomePage"}},
    {path: 'account', loadComponent: () => import('./account/account/account.component').then(m => m.AccountComponent), data: {animation: "AccountPage"}},
    {path: 'about', loadComponent: () => import('./account/about/about.component').then(m => m.AboutComponent), data: {animation: "AboutPage"}},
    {path: 'faq', loadComponent: () => import('./account/faqs/faqs.component').then(m => m.FaqsComponent), data: {animation: "FaqPage"}},
    {path: 'cart', loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent), data: {animation: "CartPage"}},
    {path: 'checkout', loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent), data: {animation: "CheckOutPage"}},
    {path: 'privacy', loadComponent: () => import('./privacypolicy/privacypolicy.component').then(m => m.PrivacypolicyComponent), data: {animation: "PrivacyPage"}},
    {path: 'search', loadComponent: () => import('./search/search.component').then(m => m.SearchComponent), data: {animation: "SearchPage"}},
    {path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent), data: {animation: "LoginPage"}},
    {path: 'signup', loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent), data: {animation: "SignupPage"}},
    {path: 'forgot-password', loadComponent: () => import('./auth/forgot-pass/forgot-pass.component').then(m => m.ForgotPassComponent), data: {animation: "ForgotPasswordPage"}},
    {path: 'signalr', loadComponent: () => import('./signalr/signalr.component').then(m => m.SignalRComponent), data: {animation: "SignalRPage"}},
    {path: 'product/:id', loadComponent: () => import('./product/product.component').then(m => m.ProductComponent), data: {animation: "ProductPage"}},
    {path: 'token/:encodedToken', loadComponent: () => import('./token-page/token-page.component').then(m => m.TokenPageComponent), data: { animation: "TokenPage" }}, 
    {path: 'change', loadComponent: () => import('./account/change/change.component').then(m => m.ChangeComponent), data: {animation: "ChangePace"}}
];
