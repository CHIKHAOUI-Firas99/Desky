import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'app/core/auth/auth.service';
import { RoleService } from 'app/core/role/role.service';
import { User } from 'app/core/user/user.types';
import { PhoneComponent } from 'app/modules/admin/dashboards/phone/phone.component';

@Component({
  selector: 'settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.scss']
})
export class SettingsAccountComponent {
  accountForm: FormGroup=new FormGroup({

    username: new FormControl(),
    role : new FormControl(),
    about   : new FormControl(),
    email   : new FormControl(),
    phone   : new FormControl(),
  });
  user: any;
  userRoleName: String;
  userPhone: any;

  /**
   * Constructor
   */
  constructor(
      private _formBuilder: UntypedFormBuilder,
      private _AuthService:AuthService,
      private _RoleService:RoleService,
      private dialog: MatDialog,

  )
  {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PhoneComponent, {
      width: "640px",
      disableClose: true,
      data: this.userPhone?this.userPhone:null,
    });
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
    this.userPhone=this._AuthService.getUserPhone()
    this.user=this._AuthService.getCurrentUser()
    this._RoleService.getAll().subscribe((d)=>
    {
     let role=d.find((n)=>n.id==this.user.role_id)
     if (role) {
      this.userRoleName=role.name
      this.accountForm = this._formBuilder.group({
         
       username: [this.user.name],
       role : [this.userRoleName],
       about   : ['Hey! This is Brian; husband, father and gamer. I\'m mostly passionate about bleeding edge tech and chocolate! 🍫'],
       email   : [this.user.email, Validators.email],
       phone   : [this.user.phoneNumber],
 
   });
   console.log(this.accountForm);
   
     }
    
    }
    );
    console.log(this.user);
    
      // Create the form
  
  }

}
