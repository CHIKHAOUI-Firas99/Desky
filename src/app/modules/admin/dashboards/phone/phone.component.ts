import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent {
  id: string;
  model: string;
  osVersion: string;
  uid: string;

  constructor(private dialogRef: MatDialogRef<PhoneComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private  dialog: MatDialog,
  private snackBar: MatSnackBar,
  private _userService:UserService
  ) {}

  ngOnInit() {
   this.id=this.data.id
   this.uid=this.data.uid
   this.model=this.data.model
   this.osVersion=this.data.osVersion
  }
  isValid() {
    return this.id && this.model && this.osVersion;
  }
  delete() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Save',
          cancel: 'No'
        },
        id:this.id
      }
    });
  

  }
  submit() {
    this.dialogRef.close({
      id: this.id,
      model: this.model,
      osVersion: this.osVersion,
    });
    this.close()
  }

  close() {
    this.dialogRef.close();
  }
}
