import { Routes } from '@angular/router';
export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)},
    {path: 'account', loadComponent: () => import('./account/account/account.component').then(m => m.AccountComponent)},
    {path: 'about', loadComponent: () => import('./account/about/about.component').then(m => m.AboutComponent)},
    {path: 'faq', loadComponent: () => import('./account/faqs/faqs.component').then(m => m.FaqsComponent)},
    {path: 'cart', loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent)},
    {path: 'checkout', loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent)},
    {path: 'privacy', loadComponent: () => import('./privacypolicy/privacypolicy.component').then(m => m.PrivacypolicyComponent)},
    {path: 'search', loadComponent: () => import('./search/search.component').then(m => m.SearchComponent)},
    {path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)},
    {path: 'signup', loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent)},
    {path: 'forgot-password', loadComponent: () => import('./auth/forgot-pass/forgot-pass.component').then(m => m.ForgotPassComponent)},
    {path: 'signalr', loadComponent: () => import('./signalr/signalr.component').then(m => m.SignalRComponent)},
    {path: 'product', loadComponent: () => import('./product/product.component').then(m => m.ProductComponent)},
];
