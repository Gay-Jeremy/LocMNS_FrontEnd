import {Component, output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  imports: [
    FormsModule
  ],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
})
export class DatePicker {

  date = '';

  confirm = output<string>();
  cancel = output<void>();

  onConfirm(): void {
    if (this.date) this.confirm.emit(this.date);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
