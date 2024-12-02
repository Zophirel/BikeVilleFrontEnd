import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SliderComponent } from '../slider/slider.component';
import { ProductListComponent } from "../product-list/product-list.component";

@Component({
    selector: 'app-home',
    imports: [NavbarComponent, SliderComponent, ProductListComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})


export class HomeComponent {

}
