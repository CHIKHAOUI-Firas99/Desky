import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { RoleService } from 'app/core/role/role.service';
import { UserService } from 'app/core/user/user.service';
import { ToastrService } from 'ngx-toastr';
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
    private _userService:UsersService, 
    private router:Router,private matdialog:MatDialog,
    private dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    private toastr:ToastrService
    
    ,private _roleService: RoleService
    , private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy
    ) {
      if(data){
    this.message = data.message || this.message;
    if (data.buttonText) {
      this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
      this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
    }
      }
  }
  refreshRoute() {
    this.route.data.subscribe(() => {
      const currentUrl = this.router.url;
      this.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    });
  }
  showToast(message:string,title:string): void {
    this.toastr.warning(message, title);
   }
   object :string=this.data.object
  onConfirmClick(): void {
    
    if (this.data.iduser) {
      this._userService.deleteUser(this.data.iduser).subscribe((data) => {
        this.showToast(this.object+' has been removed ','Success!')
        this.matdialog.closeAll()
       
        this.refreshRoute()
      });
    } 
    if (this.data.idrole) {
      this._roleService.deleteRole(this.data.idrole).subscribe((data) => {
        this.showToast(this.object+' has been removed ', 'Success!')

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
         this.refreshRoute()
        });
      });
    }

  }
  
 
 
}
