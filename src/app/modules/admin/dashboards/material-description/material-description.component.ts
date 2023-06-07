import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { RoleService } from 'app/core/role/role.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { DemandsService } from '../demands/demands.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-material-description',
  templateUrl: './material-description.component.html',
  styleUrls: ['./material-description.component.scss']
})
export class MaterialDescriptionComponent {
  errMessage: string;
  allSelected: boolean= false;
  materialdescription: any;
  constructor(
    private dialogRef: MatDialogRef<MaterialDescriptionComponent>,
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
    

    if(this.data.description){
      this.materialdescription=this.data.description
  console.log(this.materialdescription,'<<---matttt desc ');
  
      }

    
    this.demandForm = this._fb.group({
      // recipients: [[], Validators.required],
      subject: [this.demandSubject, Validators.required],
      description: [this.demandContent, Validators.required],
      deskEquipement:[this.equipementsList]
    });
  

  
  }
  


  onSubmit() {
    this.dialogRef.close(this.materialdescription)
        }
  
  closeEmailDialog(){
    this.dialog.closeAll()
  }

}
