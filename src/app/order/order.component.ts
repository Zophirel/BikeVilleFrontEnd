import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ChipListComponent } from "../chip-list/chip-list.component";
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { OrderDialog } from '../order-dialog/order-dialog.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  readonly dialog = inject(MatDialog);
  orderData: any = {};
  openDialog(): void {
    const dialogRef = this.dialog.open(OrderDialog, {
      data: {order: this.orderData},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.orderData.set(result);
      }
    });
  }

}