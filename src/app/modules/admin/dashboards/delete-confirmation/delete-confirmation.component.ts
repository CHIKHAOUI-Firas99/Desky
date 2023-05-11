import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { RoleService } from 'app/core/role/role.service';
import { UserService } from 'app/core/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { PhoneComponent } from '../phone/phone.component';
import { UsersService } from '../users.service';
import { MapService } from '../map/map.service';
import { MaterialService } from '../materials/material.service';
import { DemandsService } from '../demands/demands.service';

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
   private _mapService:MapService,
    @Inject(MAT_DIALOG_DATA) private data: any,private _UserService:UserService,
    private phonedialogRef: MatDialogRef<PhoneComponent>,
    private _userService:UsersService, 
    private router:Router,private matdialog:MatDialog,
    private dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    private toastr:ToastrService,
    private _materialService: MaterialService
    
    ,private _roleService: RoleService
    , private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy,
    private _demandsService:DemandsService
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
          this.toastr.warning('your phone has been removed', 'Success!');
          this.matdialog.closeAll();
          resolve(true);
        });
    
        dialogRefClosedPromise.then((result) => {
          console.log('The confirmation dialog was closed', result);
         this.refreshRoute()
        });
      });
    }
    if(this.data.workspaceId){
      
      
      this._mapService.deleteworkspace(this.data.workspaceId).subscribe(()=>{
        this.toastr.warning('workspace has been removed', 'Success!');
        this.matdialog.closeAll()
        this.refreshRoute()

      },err=>{this.matdialog.closeAll();this.toastr.error('error has been occured', 'Error!')})
    }
    if (this.data.idmat) {
      this._materialService.deleteMat(this.data.idmat).subscribe()
      this.toastr.warning('workspace has been removed', 'Success!');
      this.matdialog.closeAll()
      this.refreshRoute()
    }
    if (this.data.object ==='demands') {
      this._demandsService.deleteDemand(this.data.user_id,this.data.demand_id).subscribe()
      this.toastr.warning('workspace has been removed', 'Success!');
      this.matdialog.closeAll()
      this.refreshRoute()
    }

  }
  
 
 
}
