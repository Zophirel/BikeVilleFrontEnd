import {Component, inject, ViewEncapsulation} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';


export interface OrderDialog {
  animal: string;
  name: string;
}

@Component({
  selector: 'order-dialog',
  templateUrl: 'order-dialog.component.html',
  standalone: true,
  imports: [
    MatButtonModule
  ]
})
export class OrderDialog {
  
  @Input() orderCategory: string[] = ["Category 1", "Category 2", "Category 3"];
  readonly dialogRef = inject(MatDialogRef<OrderDialog>);
  readonly data = inject<OrderDialog>(MAT_DIALOG_DATA);
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
