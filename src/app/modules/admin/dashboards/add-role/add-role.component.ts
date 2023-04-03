import { Component, Inject, TemplateRef, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ActivatedRoute, Router, RouteReuseStrategy } from "@angular/router";
import { RoleService } from "app/core/role/role.service";
import { UserService } from "app/core/user/user.service";
import { log } from "fabric/fabric-impl";
import { forEach } from "lodash";
import { ColorPickerComponent } from "ngx-color-picker";
import { ToastrService } from "ngx-toastr";

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
  color = '#fff';

  

  selectedColor: string = "#9C27B0";
  colorToAdd: string ;
  colorPalette: Array<any> = [
    {
      preview: "#9c27b0e0",
      variants: [
        "#9c27b0",
        "#9c27b0de",
        "#9c27b0bd",
        "#9c27b09c",
        "#9c27b075",
        "#9c27b047",
      ],
    },
    "#00BCD4",
    "#03A9F4",
    "#B2F35C",
  ];
  alltags: any;
  tagMessage: boolean=false;





  showToast(message:string,title:string): void {
    this.toastr.success(message, title);
   }
  constructor(
    private dialogRef: MatDialogRef<AddRoleComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router,
    private _roleService: RoleService,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy,
    private dialog: MatDialog,
    private _fb:FormBuilder
  ) {}

  form:any 
  
  
  get tags(): FormArray {
    
    return this.form.get('extraTags') as FormArray;
  }


  objectOfTags(tab: Array<string>): { key: string, value: any[] }[] {
    const result = [];
    console.log(tab);
    
    this.alltags.filter(tag => {
      const tagid = tag.id;
      console.log(tagid);
      
      if ( tab.includes(tagid)) {
        
        
        const tagValue = tag.value;
        console.log(tagValue);
        
        const existingTag = result.find(obj => obj.key === tag.key);
        console.log(existingTag);
        
        if (existingTag) {
          existingTag.value.push(tagValue);
        } else {
          result.push({ key: tag.key, value: tagValue });
        }
      }
    });
    console.log(result);
    
    return result;
  }
  
  

  addTag(): void {
    const extraTags = this.form.get('extraTags') as FormArray;
    var lastTagIndex = extraTags.length - 1;
  
    // check if all previous rows have both key and value fields filled
    for (let i = 0; i <= lastTagIndex; i++) {
      const control = extraTags.at(i) as FormGroup;
      if (control.get('key').value.length === 0 || control.get('value').value.length === 0) {
        return; // don't allow addition of new row if any previous row has empty fields
      }
    }
  
    // if all previous rows are filled, allow addition of new row
    const tagFormGroup = this._fb.group({
      key: new FormControl(''),
      value: new FormControl('')
    });
  
    this.tags.push(tagFormGroup);
    lastTagIndex = extraTags.length - 1;
    this.disabled[lastTagIndex]=true
  }
  
  

  removeTag(index: number): void {
    const extraTags = this.form.get('extraTags') as FormArray;
    const lastTagIndex = extraTags.length - 1;
  
    // Check for empty key or value in each control and set corresponding disabled element to true
    for (let i = 0; i <= lastTagIndex; i++) {
      const control = extraTags.at(i) as FormGroup;
      if (control.get('key').value.length === 0 || control.get('value').value.length === 0) {
        this.disabled[i] = true;
      }
    }
    let control=extraTags.at(index)
  if (this.keys.includes(control.get('key').value)) {
    this.tagMessage=false
  }
    // Remove tag from tags FormArray
    this.tags.removeAt(index);
  
    // Remove corresponding element from disabled array
    this.disabled.splice(index, 1);
  }
  
  

  objectToArray(obj: any): { key: string, value: string }[] {
    return Object.keys(obj).map(key => ({
      key: key,
      value: obj[key],
      id: 'value-' + key
    }));
  }
  
  
  disabled: boolean[] = [];
  removedisabled=true
  keys:any=[]
  ngOnInit() {
    this.claims = this.data.tabclaims;
   
    console.log(this.data.tabtags);
    
    
    this.alltags= this.data.tabtags
    this.alltags=this.objectToArray(this.alltags)
    console.log(this.alltags);

for (let i = 0; i < this.alltags.length; i++) {
  const element = this.alltags[i];
  this.keys.push(element.key)
}
console.log(this.keys);

    this.form= this._fb.group(
      {
      name:['',Validators.required],
      claims:new FormControl(),
      color:new FormControl(this.colorToAdd,Validators.required),
      tags:new FormControl([]),
      extraTags:this._fb.array([

        this._fb.group({
          key: new FormControl(''),
          value: new FormControl('')
        })

      ])
    })
    for (let i = 0; i < this.tags.length; i++) {
      this.disabled.push(true);
    }
   
  }

cancel():boolean{

  return  this.form.get('extraTags').length>1
}


 // Set a default color
// Add a property to track whether any changes have been made



checkFormControlChanges(event: KeyboardEvent, index: number) {
  const target = event.target as HTMLInputElement;
  
  const keyControl = this.form.get('extraTags').value[index];
  if (keyControl.key === target.name && keyControl.value !== target.value) {
    // Set changesMade to false when a change is detected
  }
  
  const valueControl = this.form.get('extraTags').value[index];
  if (valueControl.value === target.name && valueControl.key !== target.value) {
    // Set changesMade to false when a change is detected
  }
  
  const formValues = this.form.value.extraTags;
  const emptyValues = formValues.filter((control: any) => !control.key || !control.value);
  console.log(formValues);
  
  if (emptyValues.length === 0) {
    console.log(emptyValues);
    
    this.disabled[index] = false;
    console.log(this.disabled);
    
    // Set changesMade to true if all values are not empty or null
  } else {
  
    this.disabled[index] = true;
  }
  if (this.keys.includes(valueControl.key)) {
    
    this.tagMessage=true
  }
  else{
    this.tagMessage=false
    console.log(this.tagMessage);
    
  }
}




// Use the changesMade property to disable the save button if no changes have been made





 


 increaseDetailRow(): void {
  this.form.push(
    new FormGroup({
      key: new FormControl(),
      value: new FormControl(),
    })
  );


}


decreaseDetailRow() {
  this.form.controls.pop();
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
    
    if(tabClaims){
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
  }
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
    let tabtags=this.objectOfTags(this.form.value['tags'])
    console.log(tabtags);
    
    this.form.value['extraTags'].forEach((tag,i) => {
      if (this.disabled[i]==false) {
        const index = tabtags.findIndex((t) => t.key === tag.key);
      if (index !== -1) {
        this.errMessage='tag key already exist';
      } else {
        tabtags.push({
          key: tag.key,
          value: tag.value.split(/[-,or;]+/)
        });
      }
      }
      
    });
    
    const role = {
      name: this.form.value['name'],
      claims: tabValidatedClaims,
      color:this.form.value['color'],
      tags: tabtags
      // extraTags:this.form.value['extraTags']
    };
    console.log(role);
    

    this._roleService.addRole(role).subscribe(() =>
   
    { this.showToast('role added','success');
    this._router.navigateByUrl('/',{skipLocationChange:true} ).then(() => {
      this._router.navigate(['/dashboards/roles']);
    });
      this.dialogRef.close()},
    (err)=>{this.errMessage=err["error"]["detail"];
    
    if (this.errMessage==undefined) {
      this.errMessage=err.name+" : "+err.statusText
     }
    
    console.log(this.errMessage);
   });
  }

  submit(form: FormGroup) {
    this.SaveVO(this.form.value["claims"])
    // console.log(form.value["ValidatedClaims"]);
  }
    // this.SaveVO(form.value["ValidatedClaims"]);
   
  onReset(f: FormGroup) {
    f.reset();
  }

  close() {
    this.dialogRef.close();
  }
}
