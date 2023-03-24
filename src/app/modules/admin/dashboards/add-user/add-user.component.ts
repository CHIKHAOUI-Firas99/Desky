import { Component, Inject, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ActivatedRoute, Router, RouteReuseStrategy } from "@angular/router";
import { AuthService } from "app/core/auth/auth.service";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"],
})
export class AddUserComponent implements OnInit {
  name: string;
  claims: any = [];
  ValidatedClaims: any = [];
  tabRoleNames: String[] = [];
  phoneNumber: string;
  email: string;
  authorization: boolean;
  role: string = "";
  errMessage:String

  constructor(
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matdialog: MatDialog,
    private _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy
  ) {}

  ngOnInit() {
    this.tabRoleNames = this.data.roles;
  }

  onReset(f: NgForm) {
    f.resetForm();
  }

  submit(form: NgForm) {
    const user = {
      name: form.value["name"],
      email: form.value["email"],
      phoneNumber: form.value["phoneNumber"],
      role: form.value["role"],
      authorization: form.value["authorization"],
    };
    this._authService.signUp(user).subscribe(() =>
     {this.matdialog.closeAll();this.refreshRoute()},
     (err)=>{console.log(err);
     ;this.errMessage=err["error"]["detail"];
     if (this.errMessage==undefined) {
      this.errMessage=err.name+" : "+err.statusText
     }
     
     console.log(this.errMessage);
    })
    
    
 
  }
  refreshRoute() {
    this.route.data.subscribe(() => {
      const currentUrl = this.router.url;
      this.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    });
  }

  close() {
    this.dialogRef.close();
  }
}
