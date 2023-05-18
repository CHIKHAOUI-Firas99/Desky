import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { RoleService } from 'app/core/role/role.service';
import { DeleteConfirmationComponent } from 'app/modules/admin/dashboards/delete-confirmation/delete-confirmation.component';
import { DemandResponseComponent } from 'app/modules/admin/dashboards/demand-response/demand-response.component';
import { DemandsService } from 'app/modules/admin/dashboards/demands/demands.service';
import { UsersService } from 'app/modules/admin/dashboards/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-material-demand',
  templateUrl: './add-material-demand.component.html',
  styleUrls: ['./add-material-demand.component.scss']
})
export class AddMaterialDemandComponent {
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
   
    this.user_id=this.data.user_id
    this.desk_id=this.data.desk_id
    this.demandForm = this._fb.group({
      // recipients: [[], Validators.required],
      object: ['', Validators.required],
      description: ['', Validators.required]
     
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

      // const pictureFile = this.base64ToFile(material.picture, 'material-picture', 'image/jpg');



     

      
      this._DemandsService.add_demand(this.demandForm.value,this.desk_id,this.user_id).subscribe((data) => {
        this.toastr.success('Demand sent','Success')
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
