import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog.component';
import { ProductCategory } from '../product/product-category.module';
import {EmittedFilterValue} from '../filter-dialog/emitted-filter.module.';

@Component({
    selector: 'app-filter',
    imports: [MatChipsModule, CommonModule],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit {
 
  @Input() category : ProductCategory | undefined;
  @Input() subCategories : ProductCategory[] | undefined;
  @Output() categoriesEmitter = new EventEmitter<Array<any>>();

  subCategoriesForUi : EmittedFilterValue[] = [];
  isSelected: boolean = false;

  ngOnInit(): void {
    try{
      if(this.subCategories != undefined){
        for(let sub of this.subCategories){
          this.subCategoriesForUi.push(new EmittedFilterValue(this.category!, sub.name, sub.productCategoryId, false));
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  readonly dialog = inject(MatDialog);
  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialog, {
      data: this.subCategoriesForUi,
      disableClose: true,
      
    });

    dialogRef.afterClosed().subscribe(result => {     
      if (result !== undefined) {
        this.subCategoriesForUi = result.subCategories;
        this.categoriesEmitter.emit(result.subCategories);
      }
    });
  }
}

