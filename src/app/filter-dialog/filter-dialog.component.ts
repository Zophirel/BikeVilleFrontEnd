import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import {EmittedFilterValue} from './emitted-filter.module.';

@Component({
  selector: 'app-filter-dialog',
  imports: [    
    MatDialogModule, 
    MatButtonModule, 
    CommonModule, 
    MatIconModule, 
    MatInputModule, 
    MatSelectModule,
    FormsModule,
    CommonModule,
    MatChipsModule,
    
  ],
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.scss'
})

export class FilterDialog {
  readonly dialogRef = inject(MatDialogRef<FilterDialog>);
  readonly data = inject<FilterDialog>(MAT_DIALOG_DATA);
  subCategories: EmittedFilterValue[] = (this.data as unknown as EmittedFilterValue[]) ;

  constructor() {
    console.log("FilterDialog constructor");
    console.log(this.subCategories);
  }

  filter(): void {
    console.log(this.subCategories);
    this.dialogRef.close({subCategories: this.subCategories});
  }

  addSubCategory(subCategory: number): void {
    this.subCategories[subCategory].selected = !this.subCategories[subCategory].selected;
  }
}
