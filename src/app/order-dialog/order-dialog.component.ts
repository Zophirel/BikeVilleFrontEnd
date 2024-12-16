import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { Product } from '../product/product.module';
import { EmittedOrderValue } from '../filter-dialog/emitted-filter.module.';

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

export class OrderDialog implements OnInit {

  orderCategory = Product.orderByProp;
  
  orderDirection : boolean = true;
  orderCategorySelectedIdx: number | null = null ;

  readonly dialogRef = inject(MatDialogRef<OrderDialog>);
  readonly data = inject<OrderDialog>(MAT_DIALOG_DATA);
  emittedValue: EmittedOrderValue = (this.data as unknown as EmittedOrderValue);

  swapOrder(): void {
    this.orderDirection = !this.orderDirection;
  }

  order(): void {
    this.dialogRef.close(
      new EmittedOrderValue(this.emittedValue.category, this.orderCategorySelectedIdx, this.orderDirection)
    );
  }

  ngOnInit(): void {
    console.log("OrderDialog constructor ");
    console.log(this.emittedValue);
  }
}
