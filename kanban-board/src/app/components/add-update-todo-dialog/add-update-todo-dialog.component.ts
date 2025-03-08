import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TaskStatus} from '../../models/todo-status.enum';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-add-update-todo-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-update-todo-dialog.component.html',
  styleUrl: './add-update-todo-dialog.component.scss'
})
export class AddUpdateTodoDialogComponent {

  todoForm: FormGroup;
  statuses = Object.values(TaskStatus); // ✅ Fetch statuses from Enum

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUpdateTodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.todoForm = this.fb.group({
      title: [data?.todo || '', Validators.required],
      status: [data?.status || TaskStatus.Pending, Validators.required]
    });
  }

  submit() {
    if (this.todoForm.valid) {
      this.dialogRef.close(this.todoForm.value); // ✅ Return the form data
    }
  }

  close() {
    this.dialogRef.close(null); // Close without adding
  }

}
