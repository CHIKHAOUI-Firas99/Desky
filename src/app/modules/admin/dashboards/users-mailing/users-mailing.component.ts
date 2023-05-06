import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { RoleService } from 'app/core/role/role.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../users.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-users-mailing',
  templateUrl: './users-mailing.component.html',
  styleUrls: ['./users-mailing.component.scss']
})
export class UsersMailingComponent {
  errMessage: string;
  allSelected: boolean= false;
  constructor(
    private dialogRef: MatDialogRef<UsersMailingComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router,
    private _roleService: RoleService,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy,
    private dialog: MatDialog,
    private _fb:FormBuilder,
    private _usersService : UsersService
    
  ) {}
  public usersList :Array <String>
  public emailSubject:String
  public emailContent:String
  // ngOnInit(){
  //   

  // }
  emailForm: FormGroup;



  ngOnInit(): void {
    this.usersList=this.data.usersEmails
    console.log(this.usersList);
    
    this.emailForm = this._fb.group({
      recipients: [[], Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });
  }
  selectAll(event: MatCheckboxChange) {
    const selectedEmails = event.checked ? this.usersList : [];
    this.emailForm.patchValue({
      recipients: selectedEmails
    });
    this.allSelected=true
  }
  
  onSelectionChange(event: MatSelectChange) {

    const selectedEmails = event.value;
    console.log(selectedEmails);
    console.log(selectedEmails.length === this.usersList.length);
    
    // this.emailForm.patchValue({
    //   recipients: selectedEmails.length === this.usersList.length ? 'All' : selectedEmails
    // });
    console.log(this.emailForm);
    
    this.allSelected = selectedEmails.length === this.usersList.length;
  }
  
  onChange(){
 
    if (this.allSelected) {
      this.emailForm.get('recipients').setValue([]);
    } else {
      this.emailForm.get('recipients').setValue(this.emailForm.get('recipients').value.length === 0 ? this.usersList : 'all');
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
  onSubmit() {
    if (this.emailForm.valid) {
      console.log(this.emailForm.value);
      
      this._usersService.sendEmails(this.emailForm.value).subscribe(()=>{
        this.toastr.success('Emails sent successfully','success')
        this.dialog.closeAll()
        this.refreshRoute()
      },(err)=>{
        console.log(err);
        this.errMessage=err["error"]["detail"]
      
        this.toastr.error(this.errMessage, 'Failed');
        
      })
    }
  }
  closeEmailDialog(){
    this.dialog.closeAll()
  }
}
