import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { RoleService } from 'app/core/role/role.service';
import { ToastrService } from 'ngx-toastr';
import { UsersMailingComponent } from '../users-mailing/users-mailing.component';
import { UsersService } from '../users.service';
import { DemandsService } from '../demands/demands.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-demand-response',
  templateUrl: './demand-response.component.html',
  styleUrls: ['./demand-response.component.scss']
})
export class DemandResponseComponent {
  errMessage: string;
  allSelected: boolean= false;
  constructor(
    private dialogRef: MatDialogRef<DemandResponseComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router,
    private _roleService: RoleService,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy,
    private dialog: MatDialog,
    private _fb:FormBuilder,
    private _usersService : UsersService,
    private _DemandsService:DemandsService
    
  ) {}
  public equipementsList :Array <String>
  public demandSubject:String
  public demandContent:String
  public user_id
  public desk_id
  public demand_id
  // ngOnInit(){
  //   

  // }
  demandForm: FormGroup;
  allMaterials:any



  ngOnInit(): void {
    console.log(this.data);
    if(this.data.equipements){
    this.equipementsList=this.data.equipements

    }
    if(this.data.description){
      this.demandContent=this.data.description
  
      }
      if(this.data.object){
        this.demandSubject=this.data.object
    
        }
        if(this.data.allMat){
          this.allMaterials=this.data.allMat
      
          }
         this.desk_id= this.data.desk_id
         this.user_id=this.data.user_id
         this.demand_id=this.data.demand_id

    console.log(this.equipementsList);
    
    this.demandForm = this._fb.group({
      // recipients: [[], Validators.required],
      subject: [this.demandSubject, Validators.required],
      description: [this.demandContent, Validators.required],
      deskEquipement:[this.equipementsList]
    });
  }
  selectAll(event: MatCheckboxChange) {
    const selectedEmails = event.checked ? this.equipementsList : [];
    this.demandForm.patchValue({
      recipients: selectedEmails
    });
    this.allSelected=true
  }
  
  onSelectionChange(event: MatSelectChange) {

    const selectedEmails = event.value;
    console.log(selectedEmails);
    console.log(selectedEmails.length === this.equipementsList.length);
    
    // this.demandForm.patchValue({
    //   recipients: selectedEmails.length === this.equipementsList.length ? 'All' : selectedEmails
    // });
    console.log(this.demandForm);
    
    this.allSelected = selectedEmails.length === this.equipementsList.length;
  }
  
  onChange(){
 
    if (this.allSelected) {
      this.demandForm.get('recipients').setValue([]);
    } else {
      this.demandForm.get('recipients').setValue(this.demandForm.get('recipients').value.length === 0 ? this.equipementsList : 'all');
    }
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
  refuse_demand() {


    this.dialog.open(DeleteConfirmationComponent, {
      width: "640px",
      disableClose: true,
      data: {
        demand_id: this.demand_id,
        user_id:this.user_id,
        object:'demands',
        message: "Refuse demand?",
        buttonText: {
          ok: "Save",
          cancel: "No",
        },
      },
    });
  }
  onSubmit() {
    if (this.demandForm.valid) {
      let demand={status:'accepted','object':this.demandSubject}
      const obj = {
        
        material: this.demandForm.get('deskEquipement').value
     
      };
      // const pictureFile = this.base64ToFile(material.picture, 'material-picture', 'image/jpg');
console.log(demand);
console.log(obj);


     console.log(Number(this.user_id),Number(this.desk_id),Number(this.demand_id),obj,demand);
     

      
      this._DemandsService.acceptDemand(Number(this.user_id),Number(this.desk_id),Number(this.demand_id),obj, demand).subscribe((data) => {
        this.toastr.success('Material updated','Success')
        console.log(data);
        this.refreshRoute()
        this.dialog.closeAll()
      },(err)=>{
        this.errMessage=err["error"]["detail"]
        
        this.toastr.error(this.errMessage, 'Failed');
       
    
    })
    }
    }
  
  closeEmailDialog(){
    this.dialog.closeAll()
  }
}
