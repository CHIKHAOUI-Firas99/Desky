import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, RouteReuseStrategy, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'settings-security',
  templateUrl: './settings-security.component.html',
  styleUrls: ['./settings-security.component.scss']
})
export class SettingsSecurityComponent {

  securityForm: UntypedFormGroup;
  errMessage: string;

  /**
   * Constructor
   */
  constructor
  (
      private _formBuilder: UntypedFormBuilder,
      private _UserService:UserService,
      private _AuthService:AuthService,
      private _router: Router,
      private route: ActivatedRoute,
      private routeReuseStrategy: RouteReuseStrategy,
      private toastr: ToastrService
  )
  {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      // Create the form
      this.securityForm = this._formBuilder.group({
          currentPassword  : ['',Validators.required],
          newPassword      : ['',[Validators.required, this.validatePasswordLength]],
          twoStep          : [true],
          askPasswordChange: [false]
      });
  }
  validatePasswordLength(control: FormControl): { [key: string]: any } | null {
    const password = control.value;
    if (password && password.length < 6) {
      return { 'passwordLength': true };
    }
    return null;
  }
  refreshRoute() {
    this.route.data.subscribe(() => {
      const currentUrl = this._router.url;
      this.routeReuseStrategy.shouldReuseRoute = () => false;
      this._router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this._router.navigate([currentUrl]);
      });
    });
  }
  onSubmit() {
    let userId = this._AuthService.getCurrentUser().id;
    let currentPassword = this.securityForm.get('currentPassword').value;
    let newPassword = this.securityForm.get('newPassword').value;
    
    let obj = {
      'current_password': currentPassword,
      'new_password': newPassword
    };
    
    this._UserService.changePassword(userId, obj).subscribe(
      (data) => {
        console.log(data);
        this.toastr.success('Password updated', 'success');
        this.refreshRoute();
      },
      (err) => {
        console.log(err);
        this.errMessage=err["error"]["detail"]
        this.toastr.error(this.errMessage, 'Error');
      }
    );
  }
  
}
