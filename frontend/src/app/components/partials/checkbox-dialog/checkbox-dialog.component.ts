import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-checkbox-dialog',
  templateUrl: './checkbox-dialog.component.html',
  styleUrls: ['./checkbox-dialog.component.css']
})
export class CheckboxDialogComponent {
  options!: string[];
  selectedOptions: { [key: string]: boolean } = {};

  constructor(
    public dialogRef: MatDialogRef<CheckboxDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { options: string[] }
  ) {
    this.options = data.options;
  }

  closeDialog(): void {
    this.dialogRef.close(this.selectedOptions);
  }

}
