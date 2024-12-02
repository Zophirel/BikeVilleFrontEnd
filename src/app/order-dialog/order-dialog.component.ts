import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'order-dialog',
  templateUrl: 'order-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule]

})
export class OrderDialog {
  @Input() orderCategory: string[] = ["Category 1", "Category 2", "Category 3"];
  readonly dialogRef = inject(MatDialogRef<OrderDialog>);
  readonly data = inject<OrderDialog>(MAT_DIALOG_DATA);
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
