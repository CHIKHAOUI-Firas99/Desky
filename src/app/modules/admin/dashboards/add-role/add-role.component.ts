import { Component, Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ActivatedRoute, Router, RouteReuseStrategy } from "@angular/router";
import { RoleService } from "app/core/role/role.service";
import { UserService } from "app/core/user/user.service";

@Component({
  selector: "app-add-role",
  templateUrl: "./add-role.component.html",
  styleUrls: ["./add-role.component.scss"],
})
export class AddRoleComponent {
  name: string;
  claims: any = [];
  ValidatedClaims: any = [];
  errMessage: any;

  constructor(
    private dialogRef: MatDialogRef<AddRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router,
    private _roleService: RoleService,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy
  ) {}

  ngOnInit() {
    this.claims = this.data.tabclaims;
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

  getObjectNames(tab: Array<any>) {
    let objects = [];
    tab.forEach((element) => {
      objects.push(element["name"]);
    });
    console.log(objects);

    return objects;
  }
  SaveVO(tabClaims) {
    let tabValidatedClaims = [];
    tabClaims.forEach((element) => {
      let obj = "";
      const t = this.claims.find((n) =>
        n["items"].find((item) => item["value"] === element)
      );
      console.log(t);
      const elm = t["items"].find((e) => e["value"] === element);
      let test = elm["value"] == element;
      let rights = "";
      if (elm.label.includes("create") && test == true) {
        rights += "c";
      }
      if (elm.label.includes("update") && test == true) {
        rights += "u";
      }
      if (elm.label.includes("delete") && test == true) {
        rights += "d";
      }
      if (elm.label.includes("read") && test == true) {
        rights += "r";
      }
      obj = t["name"];
      const existingObj = tabValidatedClaims.find(
        (item) => item.object === obj
      );
      if (existingObj) {
        existingObj.rights += rights;
      } else {
        tabValidatedClaims.push({ object: obj, rights: rights });
      }
    });

    let tab = this.getObjectNames(this.claims);
    console.log(tab);

    let validatedclaimesobjects = [];
    tabValidatedClaims.forEach((elm) => {
      validatedclaimesobjects.push(elm["object"]);
    });
    tab.forEach((key) => {
      if (!validatedclaimesobjects.includes(key)) {
        tabValidatedClaims.push({ object: key, rights: "" });
      }
    });
    const role = {
      name: this.name,
      claims: tabValidatedClaims,
    };

    this._roleService.addRole(role).subscribe(() =>
    {this.dialogRef.close()},
    (err)=>{this.errMessage=err["error"]["detail"];
    
    if (this.errMessage==undefined) {
      this.errMessage=err.name+" : "+err.statusText
     }
    
    console.log(this.errMessage);
   });
  }

  submit(form: NgForm) {
    this.SaveVO(form.value["ValidatedClaims"]);
  
  }
  onReset(f: NgForm) {
    f.resetForm();
  }

  close() {
    this.dialogRef.close();
  }
}
