import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleService } from 'app/core/role/role.service';
import { UserService } from 'app/core/user/user.service';
import { PhoneComponent } from '../phone/phone.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent {
  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  ;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,private _UserService:UserService,
    private phonedialogRef: MatDialogRef<PhoneComponent>,
    private _financeService:UsersService, 
    private router:Router,private matdialog:MatDialog,
    private dialogRef: MatDialogRef<DeleteConfirmationComponent>
    
    ,private _roleService: RoleService
    ) {
      if(data){
    this.message = data.message || this.message;
    if (data.buttonText) {
      this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
      this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
    }
      }
  }

  onConfirmClick(): void {
    
    if (this.data.iduser) {
      this._financeService.deleteUser(this.data.iduser).subscribe((data) => {
   
        this.matdialog.closeAll();
        
      });
    } 
    if (this.data.idrole) {
      this._roleService.deleteRole(this.data.idrole).subscribe((data) => {
        const dialogRefClosedPromise = new Promise((resolve) => {
          this.matdialog.closeAll();
          resolve(true);
        });
    
        dialogRefClosedPromise.then((result) => {
          console.log('The confirmation dialog was closed', result);
          this.router.navigateByUrl('/',{skipLocationChange:true} ).then(() => {
            this.router.navigate(['/dashboards/roles']);
          });
        });
        
      });
    }
    
    if(this.data.id) {
      this._UserService.deletePhone(this.data.id).subscribe(() => {
        const dialogRefClosedPromise = new Promise((resolve) => {
          this.matdialog.closeAll();
          resolve(true);
        });
    
        dialogRefClosedPromise.then((result) => {
          console.log('The confirmation dialog was closed', result);
          this.router.navigateByUrl('/',{skipLocationChange:true} ).then(() => {
            this.router.navigate(['/dashboards/finance']);
          });
        });
      });
    }

  }
  
  
 
}
