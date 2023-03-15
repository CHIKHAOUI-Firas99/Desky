import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'app/core/auth/auth.service';
import { ClaimsService } from 'app/core/claimsManagement/claims.service';
import { RoleService } from 'app/core/role/role.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ApexOptions } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { AddUserComponent } from '../add-user/add-user.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { PhoneComponent } from '../phone/phone.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('iduser') iduser: ElementRef;
  Tabusers:User[]=[]
  idsUser:any
  data: any;
canEdit:boolean;
canDelete:boolean;
canAdd:boolean
  accountBalanceOptions: ApexOptions;
  tabRoleNames:Array<String>
  recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  recentTransactionsTableColumns: string[] = ['transactionId', 'date', 'name', 'amount', 'status'];
userRole:String
  users = new MatTableDataSource<any>();
  isLoading = true;
  pageNumber: number = 1;
displayPassword=false
  VOForm: FormGroup= this._formBuilder.group({
      VORows: this._formBuilder.array([])
    });

  isEditableNew: boolean = true;

  displayedColumns: string[] = ['user_id', 'name', 'email', 'phone_number','roles','phone','authorization','action'];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  paginatorList: HTMLCollectionOf<Element>;
  currentIndex: any;
  /**
   * Constructor
   */
  constructor(private _usersService: UsersService,
      private fb: FormBuilder,
      private _formBuilder: FormBuilder,
      private _authService:AuthService,
      private _roleService:RoleService,
      private  dialog: MatDialog,
      private snackBar: MatSnackBar,
      private _claimsService:ClaimsService,
      private _userService:UserService)
  
      {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  pageSize: number=0;
  pageIndex: number;
  length: number;
  goTo: number;
  pageNumbers: number[];
  
  @Input() disabled = false;
  @Input() hidePageSize = false;
  @Input() pageSizeOptions: number[];
  @Input() showFirstLastButtons = false;
  @Output() page = new EventEmitter<PageEvent>();
  @Input("pageIndex") set pageIndexChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
  }
 

  

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    const data = this.Tabusers.slice(startIndex, endIndex);
    this.fillFormTab(data);
  }
  

  goToPage() {
      this.paginator.pageIndex = this.pageNumber - 1;
      this.paginator.page.next({
        pageIndex: this.paginator.pageIndex+1,
        pageSize: this.paginator.pageSize,
        length: this.paginator.length
      });
      this.getUsers()
      
    }

  paginationChange(pageEvt: PageEvent) {
    this.length = pageEvt.length;
    this.pageIndex = pageEvt.pageIndex;
    this.pageSize = pageEvt.pageSize;
    
    console.log(this.pageSize);
    console.log(this.pageIndex);
    
    
  //   this.updateGoto();
    this.emitPageEvent(pageEvt);
  }

  goToChange() {
    this.paginator.pageIndex = this.goTo - 1;
    const event: PageEvent = {
      length: this.paginator.length,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    };
    this.paginator.page.next(event);
    this.emitPageEvent(event);
  }

  emitPageEvent(pageEvent: PageEvent) {
    this.page.next(pageEvent);
  }
  ngOnInit() 
  {
    this._authService.dispalyAdminDashboard().subscribe((data) => {
      let obj=this._claimsService.manageObject(data["details"],'users')
      this.canAdd=obj["create"]
      this.canEdit=obj["update"]
      this.canDelete=obj["delete"]
    });
      this._roleService.getAllRoles().subscribe(data=>this.tabRoleNames=data)
      this.getUsers();
              console.log(this.getPhoneInfo(this.VOForm,1));
              
  }

  openDialog(VOFormElement,index): void {
    const dialogRef = this.dialog.open(PhoneComponent,{
      width: '640px',disableClose: true ,
      data: this.getPhoneInfo(VOFormElement,index)
    });
}



fillFormTab(tab:Array<any>){
  this.VOForm = this.fb.group({
      VORows: this.fb.array(tab.filter(user => user != undefined).map(val => this.fb.group(
          {
      id: new FormControl(val.id),
      name: new FormControl(val.name),
      email: new FormControl(val.email),
      phoneNumber: new FormControl(val.phoneNumber),
      roles: new FormControl(val.role),
      phone:new FormControl(val.phone),
      authorization:new FormControl(val.authorization),
      action: new FormControl('existingRecord'),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false),
    })
    )) //end of fb array
  }); // end of form group cretation
  this.isLoading = false;
  this.users = new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);

}



getPhoneInfo(VOFormElement,index){
const row = VOFormElement.get('VORows')?.at(index);
console.log(row);

  const phone = row?.get('phone')?.value ?? null;
  return phone
}
getUsers() {



  this._userService.getAllUsers().subscribe((data) => {
    this.Tabusers = data;
    this.fillFormTab(this.Tabusers);
    this.users.paginator = this.paginator;
    const filterPredicate = this.users.filterPredicate;
    this.users.filterPredicate = (data: AbstractControl, filter) => {
      return filterPredicate.call(this.users, data.value, filter);
    };
  });
  // this.updateGoto();
}


 getuserRoles(id:number)
 {   
  this._usersService.getRoleByIdUser(id).subscribe((role)=>this.userRole=role)
}

  /**
   * After view init
   */
  ngAfterViewInit(): void
  {
      this.paginatorList = document.getElementsByClassName('mat-paginator-range-label');
      this.onPaginateChange(this.paginator, this.paginatorList);
      this.paginator.page.subscribe(() => { // this is page change event
      this.onPaginateChange(this.paginator, this.paginatorList);
      })

  }

  applyFilter(event: Event) 
  {
      const filterValue = (event.target as HTMLInputElement).value;    
      this.users.filter = filterValue.trim().toLowerCase();
      if (this.users.filter.length>0) 
      {
          let u=    this.Tabusers.filter((n)=> n.id.toString().includes(this.users.filter)|| n.email.includes(this.users.filter) || 
              n.phoneNumber.includes(this.users.filter) || n.name.includes(this.users.filter) || n.role.includes(this.users.filter)
              ||n.authorization.toString().includes(this.users.filter)
              
              );

            this.fillFormTab(u)
  
           
      }
     
else this.fillFormTab(this.Tabusers);



}




  AddNewRow() {
      // this.getBasicDetails();
    
      this.displayPassword=true
      const dialogRef = this.dialog.open(AddUserComponent,{
        width: '640px',disableClose: true ,
        data:{"roles":this.tabRoleNames}
        
      });

      
    }
  
    // this function will enabled the select field for editd
    EditSVO(VOFormElement, i) {
      // VOFormElement.get('VORows').at(i).get('name').disabled(false)
      VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
      // this.isEditableNew = true;   
      
    }





getRoles(VOFormElement, index: number) {
  const row = VOFormElement.get('VORows')?.at(index);
  const roles = row?.get('roles')?.value ?? null;
  return roles
  

}

delete(VOFormElement, index: number){
const row = VOFormElement.get('VORows')?.at(index);

  const id = row?.get('id')?.value ?? null;
  this.dialog.open(DeleteConfirmationComponent,{
    width: '640px',disableClose: true ,
    data: {'iduser':id,
  
  
    message: 'Are you sure want to delete?',
    buttonText: {
      ok: 'Save',
      cancel: 'No'
    },
  }
  });
  // if(ok){
  //     const row = VOFormElement.get('VORows')?.at(index);
  //     const id = row?.get('id')?.value ?? null;
  //     this._usersService.deleteUser(id).subscribe((data) => {
  //         this.getUsers()
          
  //       });
  // }

}










  
    // On click of correct button in table (after click on edit) this method will call
    SaveVO(VOFormElement, i) {




     
      
      
      const row = VOFormElement.get('VORows').at(i);
      
    

      
      const id = row.get('id').value;

      
      
       const user = {

        name: row.get('name').value,
        email: row.get('email').value,
        phoneNumber: row.get('phoneNumber').value,
        role: row.get('roles').value,
        authorization: row.get('authorization').value
      };
    console.log(" the row ----->"+user.role);

    console.log('the user is that i '+"' ll update is "+' ----->'+JSON.stringify(user));
    
console.log('save function id ---->',id);

     
      if(id){
          this._usersService.updateUser(id, user).subscribe((data) => {
console.log('save function data ---->',data);

      
            }, (error) => {
            });
      }
    
          
 
      
       else {
          
        
        this._authService.signUp(user).subscribe(() => {
          this.getUsers();
        });
      }
      VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
  
  }
    
    
  
    // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
    CancelSVO(VOFormElement, i) {

      const row = VOFormElement.get('VORows').at(i);
    
      let id= row.get('id').value;
      if (!id) {
          this.fillFormTab(this.Tabusers)}
       
      
      row.get('name').patchValue(this.Tabusers[i].name);
      row.get('email').patchValue(this.Tabusers[i].email);
      row.get('phoneNumber').patchValue(this.Tabusers[i].phoneNumber);
      row.get('authorization').patchValue(this.Tabusers[i].authorization);
      row.get('isEditable').patchValue(true);

    }
  








  idx: number;
onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
   setTimeout((idx) => {
       let from = (paginator.pageSize * paginator.pageIndex) + 1;

       let to = (paginator.length < paginator.pageSize * (paginator.pageIndex + 1))
           ? paginator.length
           : paginator.pageSize * (paginator.pageIndex + 1);

       let toFrom = (paginator.length == 0) ? 0 : `${from} - ${to}`;
       let pageNumber = (paginator.length == 0) ? `0 of 0` : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
       let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

       if (list.length >= 1)
           list[0].innerHTML = rows; 

   }, 0, paginator.pageIndex);
}

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }

 



  initiateVOForm(): FormGroup {
      return this.fb.group({
  
                  id: new FormControl(''),
                  name: new FormControl(''),
                  email: new FormControl(''),
                  phoneNumber: new FormControl(''),
                  roles: new FormControl(''),
                  authorization:new FormControl(''),
                  action: new FormControl('newRecord'),
                  isEditable: new FormControl(false),
                  isNewRow: new FormControl(true),
      });
    }

}
