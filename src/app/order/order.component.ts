import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { OrderDialog } from '../order-dialog/order-dialog.component';
import { EmittedOrderValue } from '../filter-dialog/emitted-filter.module.';
import { ProductCategory } from '../product/product-category.module';

@Component({
    selector: 'app-order',
    imports: [CommonModule, MatChipsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss'
})
export class OrderComponent {
  
  readonly dialog = inject(MatDialog);
  @Input() category: ProductCategory | undefined;
  @Output() orderByEmitter = new EventEmitter<EmittedOrderValue>();
 
  orderData: EmittedOrderValue | undefined;

  openDialog(): void {
    this.orderData = new EmittedOrderValue(this.category!, null, true);
    const dialogRef = this.dialog.open(OrderDialog, {
      data: this.orderData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if (result !== undefined) {
        this.orderData = new EmittedOrderValue(this.category!, result.category, result.direction);
        this.orderByEmitter.emit(result);
      }
    });
  }

}