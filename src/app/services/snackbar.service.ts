import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackbar: MatSnackBar
  ) { }


  public success(message: string): void {
    this.snackbar.open(message, '', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration:3000,
      panelClass:['success-snackbar']
    });
  }
  
  public error(message: string): void {
    this.snackbar.open(message, '', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration:3000,
      panelClass:['error-snackbar']
    });
  }

  public info(message: string): void {
    this.snackbar.open(message, '', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration:3000,
      panelClass:['info-snackbar']
    });
  }
}
