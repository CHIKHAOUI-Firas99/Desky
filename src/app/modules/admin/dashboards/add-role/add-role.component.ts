import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from 'app/core/role/role.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent {
  name: string;
  claims:any= [];
  ValidatedClaims:any=[]
;

  constructor(private dialogRef: MatDialogRef<AddRoleComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private  dialog: MatDialog,
 
  private _roleService:RoleService
  ) {

  }

  ngOnInit() {
    this._roleService.getAllClaims().subscribe((data)=>{
      console.log(data);
      
      this.claims=this._roleService.transformObject(data)[2]
      console.log(this.claims);
      
    
    })
   
   
  }
  isValid() {
    return this.name && this.claims;
  }
  // d() {
  //   const dialogRef = this.dialog.open(DeletePhoneConfirmationComponent,{
  //     data:{
  //       message: 'Are you sure want to delete?',
  //       buttonText: {
  //         ok: 'Save',
  //         cancel: 'No'
  //       },
  //       id:this.id
  //     }
  //   });
  

  // }

  getObjectNames(tab:Array<any>){
    let objects=[]
   tab.forEach(element => {
     objects.push(element['name'])
   });
   console.log(objects);
   
   return objects
   }
  SaveVO() {
   
  
 
    let tabValidatedClaims = [];
  
  
 
    this.ValidatedClaims.forEach(element => {
      let obj = '';
      const t = this.claims.find((n) => n['items'].find(item => item['value'] === element));
      console.log(t);
      const elm = t['items'].find(e => e['value'] === element);
  let test= elm['value']==element
  let rights = '';
      if (elm.label.includes('create') && test == true) {
        rights += 'c';
      }
      if (elm.label.includes('update') && test == true) {
        rights += 'u';
      }
      if (elm.label.includes('delete') && test == true) {
        
        rights += 'd';
      }
      if (elm.label.includes('read') && test == true) {
        rights += 'r';
      }
  
      obj = t['name'];
      const existingObj = tabValidatedClaims.find(item => item.object === obj);
      if (existingObj) {
        existingObj.rights += rights;
      } else {
        tabValidatedClaims.push({ object: obj, rights: rights });
      }
    });


let tab=  this.getObjectNames(this.claims)
console.log(tab);

   let validatedclaimesobjects=[]
   tabValidatedClaims.forEach(elm => {
  
      validatedclaimesobjects.push(elm['object'])
      
    
    
  ;
   }
  );
  tab.forEach(key => {
    if (!validatedclaimesobjects.includes(key)) {
      tabValidatedClaims.push({object:key,rights:''})
        
      }
  }); 
    const role = {
      name: this.name,
      claims: tabValidatedClaims
    };
  
    
      this._roleService.addRole(role).subscribe((data) => {
        console.log(role);
      });
      
  
    
  }

  submit() {
    this.SaveVO()
    this.close()
  }

  close()
  {
    this.dialogRef.close();
  }
}
