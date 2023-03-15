import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { RoleService } from 'app/core/role/role.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  name: string;
  claims:any= [];
  ValidatedClaims:any=[]
;
  tabRoleNames: String[]=[];
  phoneNumber: string;
  email: string;
  authorization: boolean;
  role: string="";

  constructor(
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matdialog: MatDialog,
    private _authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private _roleService: RoleService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
   this.tabRoleNames=this.data.roles
  }

  
  isValid() {
    return this.name!="" && this.email!="" && this.role!="";
  }
 
  submit() {
    const user = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      role: this.role,
      authorization: this.authorization
    };
    this._authService.signUp(user).subscribe(() => {
     
    });
    this.matdialog.closeAll();
    this.router.navigateByUrl('/',{skipLocationChange:true} ).then(() => {
      this.router.navigate(['/dashboards/users']);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
