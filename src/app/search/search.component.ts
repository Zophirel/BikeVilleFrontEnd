import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatTabsModule } from '@angular/material/tabs'; 
import { ProductListComponent } from '../product-list/product-list.component';
import { FilterComponent } from '../filter/filter.component';
import { OrderComponent } from "../order/order.component";
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-search',
    imports: [
        NavbarComponent,
        MatTabsModule,
        ProductListComponent,
        FilterComponent,
        OrderComponent,
        MatButtonModule
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})

@Injectable({providedIn: 'root'})

export class SearchComponent implements OnInit {
  tabSelectedIndex : Number = 0;
  
  ngOnInit(){

  }

  selectTab(index: Number){
    this.tabSelectedIndex = index;
  }
}
