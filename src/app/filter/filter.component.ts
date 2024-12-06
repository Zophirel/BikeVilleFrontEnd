import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog.component';
import { ProductCategory } from '../product/product-category.module';

@Component({
    selector: 'app-filter',
    imports: [MatChipsModule, CommonModule],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit {
  @Input() categories : ProductCategory[] | undefined;
  @Output() categoriesEmitter = new EventEmitter<Array<any>>();

  isSelected: boolean = false;
  subCategories: Array<Array<any>> = [];
  
  ngOnInit(): void {
    console.log("FilterComponent Categories");
    try{
      for(let subCat of this.categories!){
        this.subCategories.push([subCat.name, false]); 
      }
    }catch(e){
      console.log(e);
    }
  }

  readonly dialog = inject(MatDialog);
  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialog, {
      data: this.subCategories,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log("FilterComponent Result");
        console.log(result);
        this.subCategories = result.subCategories;
        this.categoriesEmitter.emit(result);
      }
    });
  }
}

