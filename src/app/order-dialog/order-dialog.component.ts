import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
@Component({
  selector: 'order-dialog',
  templateUrl: 'order-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatButtonModule, 
    CommonModule, 
    MatIconModule, 
    MatInputModule, 
    MatSelectModule,
    FormsModule,
    CommonModule
  ]

})
export class OrderDialog {
  @Input() orderCategory: string[] = ["Category 1", "Category 2", "Category 3"];
  
  orderDirection : boolean = true;
  orderCategorySelectedIdx: string  = "0";

  readonly dialogRef = inject(MatDialogRef<OrderDialog>);
  readonly data = inject<OrderDialog>(MAT_DIALOG_DATA);
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  swapOrder(): void {
    this.orderDirection = !this.orderDirection;
  }

  order(): void {
    console.log(this.orderCategorySelectedIdx);
    console.log(this.orderDirection);
    this.dialogRef.close({category: this.orderCategorySelectedIdx, direction: this.orderDirection});
  }
}
