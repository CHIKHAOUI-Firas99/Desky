import { Component, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ClaimsService } from 'app/core/claimsManagement/claims.service';
import { RoleService } from 'app/core/role/role.service';
import { Role } from 'app/core/role/role.types';
import { DeleteConfirmationComponent } from 'app/modules/admin/dashboards/delete-confirmation/delete-confirmation.component';
import { DemandResponseComponent } from 'app/modules/admin/dashboards/demand-response/demand-response.component';
import { DemandsService } from 'app/modules/admin/dashboards/demands/demands.service';
import { MaterialService } from 'app/modules/admin/dashboards/materials/material.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ReservationserviceService } from './reservationservice.service';
import { AddMaterialDemandComponent } from '../add-material-demand/add-material-demand.component';

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrls: ['./user-reservations.component.scss']
})
export class UserReservationsComponent {
  groups: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  tabUserReservations: any;
  idsUser: any;
  data: any;
  tabRoleNames: Array<Role>;
  userRole: String;
  reservations = new MatTableDataSource<any>();
  isLoading = true;
  pageNumber: number = 1;
  displayPassword = false;
  VOForm: FormGroup = this._formBuilder.group({
    VORows: this._formBuilder.array([]),
  });
  isEditableNew: boolean = true;
  displayedColumns: string[] = ["date", "start_time", "end_time","desk_id","workspace","type","status","materialdemand","action"];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  paginatorList: HTMLCollectionOf<Element>;
  currentIndex: any;
  claims: any;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
  allTags: any;
  inUpdate: boolean=false;
  mytags: any;
  i: number=0;
  errMessage: any;
  pic: string;
  file: File;
  allMat:any;
  /**
   * Constructor
   */
  constructor(
    private renderer: Renderer2,
    private _router: Router,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _roleService: RoleService,
    private _materialService: MaterialService,
    private dialog: MatDialog,
    private _claimsService: ClaimsService,
    private toastr: ToastrService,
    private _DemandsService:DemandsService,
    private _reservationserviceService:ReservationserviceService

  ) {}
  writeValue(obj: any): void {
    throw new Error("Method not implemented.");
  }
  registerOnChange(fn: any): void {
    throw new Error("Method not implemented.");
  }
  registerOnTouched(fn: any): void {
    throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }
  pageSize: number = 0;
  pageIndex: number;
  length: number;
  goTo: number;
  pageNumbers: number[];
  selected: boolean = true;
  @Input() disabled = false;
  @Input() hidePageSize = false;
  @Input() pageSizeOptions: number[];
  @Input() showFirstLastButtons = false;
  @Output() page = new EventEmitter<PageEvent>();
  @Input("pageIndex") set pageIndexChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.reservations.filter = filterValue.trim().toLowerCase();
    
    if (this.reservations.filter.length > 0) {
      let u = this.tabUserReservations.filter(
        (n) =>
          n.date.toString().toLowerCase().includes(this.reservations.filter) ||
          n.desk_id.toString().toLowerCase().includes(this.reservations.filter)||
          n.start_time.toString().toLowerCase().includes(this.reservations.filter)||
          n.end_time.toString().toLowerCase().includes(this.reservations.filter)||
          n.status.toString().toLowerCase().includes(this.reservations.filter)||
          n.workspace.toString().toLowerCase().includes(this.reservations.filter)||
          n.anonymous.toString().toLowerCase().includes(this.reservations.filter)


     
          );
      this.fillFormTab(u);
    } else this.fillFormTab(this.tabUserReservations);
  }

  isCurrentDateAndTimeGreaterThan(date: string, time: string): boolean {
    const providedDateTime = new Date(`${date}T${time}`);
    const currentDateTime = new Date();
  
    if (currentDateTime.getTime() > providedDateTime.getTime()) {
      return true;
    }
  
    return false;
  }
  
  choseFile()
  {
    const elementToClick = document.getElementById('myFile');
console.log(elementToClick);

if (elementToClick) {
this.renderer.selectRootElement(elementToClick).click();
}
  }
  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    const data = this.tabUserReservations.slice(startIndex, endIndex);
    this.fillFormTab(data);
  }
  
  goToPage() {
    this.paginator.pageIndex = this.pageNumber - 1;
    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex + 1,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
    });
    this.getDemands();
  }
  paginationChange(pageEvt: PageEvent) {
    this.length = pageEvt.length;
    this.pageIndex = pageEvt.pageIndex;
    this.pageSize = pageEvt.pageSize;
    this.emitPageEvent(pageEvt);
  }
  goToChange() {
    this.paginator.pageIndex = this.goTo - 1;
    const event: PageEvent = {
      length: this.paginator.length,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
    };
    this.paginator.page.next(event);
    this.emitPageEvent(event);
  }
  emitPageEvent(pageEvent: PageEvent)
  {
    this.page.next(pageEvent);
  }
  tabAllClaims = [];
  allclaims: any = [];
  objectToArray(obj: any): { key: string, value: string }[] {
    return Object.keys(obj).map(key => ({
      key:key,
      value:obj.value,
      id:'value-'+key 
    }));
  }
   async ngOnInit() {
    
    await  this.getDemands()

 
  }



tags:Array<any>=[]



 fillFormTab(tab: Array<any>) {
  try {
    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        tab
          .filter((demand) => demand != undefined)
          .map( (val) => {
            
            //--------------CLAIMS----------------//
          
            return  this.fb.group({
              // id:new FormControl(val.id),
              desk_id: new FormControl(val.desk_id),
              start_time: new FormControl(val.start_time),
              end_time: new FormControl(val.end_time),

              workspace: new FormControl(val.workspace),
              // object: new FormControl(val.object),
              // equipements: new FormControl(val.equipements),
              anonymous:new FormControl(val.anonymous),
              date:new FormControl(val.date),
              status:new FormControl(val.status),
              action: new FormControl("existingRecord"),
              isEditable: new FormControl(true),
              isNewRow: new FormControl(false),
            });
          })
      ),
    });
    
    this.isLoading = false;
    this.reservations = new MatTableDataSource(
      (this.VOForm.get("VORows") as FormArray).controls
    );
    
  } catch (error) {
    console.log(error);
    
  }
  // move initialization outside of .map() function
 
 console.log(
  this.VOForm.get("VORows") 
 );
 
}
isDarkColor(hexColor: string): boolean {
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if luminance is less than 0.5 (dark), false otherwise (light)
  return luminance < 0.5;
}



onFileSelect(VOFormElement,event: any,i) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    const row = VOFormElement.get("VORows")?.at(i);
    row.get('picture')?.setValue(file);
  }
}
getPictureUrl(picture) {
  let base64Picture;
  
  try {
    // Try to decode the base64-encoded picture
    base64Picture = atob(picture);
    
  } catch (e) {
    console.error("Invalid base64 string:", picture);
    return "";
  }
  
  // Construct the data URL for the picture
  const dataUrl = `data:image/jpeg;base64,${base64Picture}`;

  return dataUrl;
}




  async getDemands() {
    try {
      let id =this._authService.getCurrentUser().id
      const data = await this._reservationserviceService.get_user_reservations(id).toPromise();
      console.log(data);
      
      this.tabUserReservations = data;
      console.log(this.tabUserReservations);
      
      this.fillFormTab(this.tabUserReservations);
      this.reservations.paginator = this.paginator;
      const filterPredicate = this.reservations.filterPredicate;
      this.reservations.filterPredicate = (data: AbstractControl, filter) => {
        return filterPredicate.call(this.reservations, data.value, filter);
      };

      
    } catch (err) {
      console.log(err);
    }
  }
  

  ngAfterViewInit(): void {
   

    this.paginatorList = document.getElementsByClassName(
      "mat-paginator-range-label"
    );
    this.onPaginateChange(this.paginator, this.paginatorList);
    this.paginator.page.subscribe(() => {
      // this is page change event
      this.onPaginateChange(this.paginator, this.paginatorList);
    });
  }
  AddNewRow() {
    this.displayPassword = true;
    const control = this.VOForm.get("VORows") as FormArray;
    control.insert(0, this.initiateVOForm());
    this.reservations = new MatTableDataSource(control.controls);
  }
  EditSVO(VOFormElement, i) {
    VOFormElement.get("VORows").at(i).get("isEditable").patchValue(false);
    this.inUpdate=true
  }
  delete(VOFormElement, index: number) {
    const row = VOFormElement.get("VORows")?.at(index);
    const desk_id = row?.get("desk_id")?.value ?? null;
    const user_id = this._authService.getCurrentUser().id;
    const date = row?.get("date")?.value ?? null;
    const start_time=row?.get("start_time")?.value ?? null;
    const end_time=row?.get("end_time")?.value ?? null;



    this.dialog.open(DeleteConfirmationComponent, {
      width: "640px",
      disableClose: true,
      data: {
user_id,desk_id,date,start_time,end_time,
        object:'cancel_reservation',
        message: "Cancel reservation !",
        buttonText: {
          ok: "Save",
          cancel: "No",
        },
      },
    });
  }
 




  SaveVO(VOFormElement, i) {
    const row = VOFormElement.get("VORows").at(i);
    const id = row.get("desk_id").value;
    const demandid = row.get("id").value;
    const user_id = row.get("user_id").value;
  
    if (id) {
      const pictureElement = row.get("picture");
   
      let demand={status:'accepted'}
        const obj = {
          
          material: row.get("equipements").value
       
        };
        // const pictureFile = this.base64ToFile(material.picture, 'material-picture', 'image/jpg');
console.log(demand);
console.log(obj);


       console.log(Number(user_id),Number(id),Number(demandid));
       

        
        this._DemandsService.acceptDemand(Number(user_id),Number(id),Number(demandid),obj, demand).subscribe((data) => {
          this.toastr.success('Material updated','Success')
          console.log(data);
          this.refreshRoute()
        },(err)=>{
          this.errMessage=err["error"]["detail"]
          this.CancelSVO(this.VOForm,i)
          this.toastr.error(this.errMessage, 'Failed');
         
      
      })
      }
      
    
  }
  

  
  base64ToFile(base64String: string, fileName: string, fileType: string): File {
    if (typeof base64String !== 'string') {
      throw new Error('Invalid base64 string');
    }
    const base64Regex = /^data:(.*);base64,(.*)$/;
    const matches = base64String.match(base64Regex);
    if (matches && matches.length === 3) {
      const binaryString = atob(matches[2]);
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: fileType });
      const file = new File([blob], fileName, { type: fileType });
      return file;
    } else {
      throw new Error('Invalid base64 string');
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

showToast(message:string,title:string): void {
    this.toastr.success(message, title);
   }




   openDialog(VOFormElement,index) {
    try {
      const row = VOFormElement.get("VORows").at(index);

     
      const desk_id = row.get("desk_id").value;
      const user_id = this._authService.getCurrentUser().id;
      
      
      // Handle the data here
      const dialogRef = this.dialog.open(AddMaterialDemandComponent, {
        width: '600px',
        data: {
          desk_id,
          user_id
        }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        // Process the result of the dialog here
        console.log('Dialog result:', result);
      });
    } catch (error) {
      // Handle the error here
      console.error(error);
    }

    
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(VOFormElement, i) {
    const row = VOFormElement.get("VORows").at(i);

    let id = row.get("desk_id").value;
    if (!id) {
      this.fillFormTab(this.tabUserReservations);
    }

      row
      .get("equipements")
      .patchValue(
      this.tabUserReservations[i].equipements 
      );

    row.get("isEditable").patchValue(true);
    localStorage.removeItem('ckeckedids')
    localStorage.removeItem('tagsArr')
    this.mytags=this.tags[i]
    this.inUpdate=false
  }

  idx: number;
  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
    setTimeout(
      (idx) => {
        let from = paginator.pageSize * paginator.pageIndex + 1;

        let to =
          paginator.length < paginator.pageSize * (paginator.pageIndex + 1)
            ? paginator.length
            : paginator.pageSize * (paginator.pageIndex + 1);

        let toFrom = paginator.length == 0 ? 0 : `${from} - ${to}`;
        let pageNumber =
          paginator.length == 0
            ? `0 of 0`
            : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
        let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

        if (list.length >= 1) list[0].innerHTML = rows;
      },
      0,
      paginator.pageIndex
    );
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
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
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  initiateVOForm(): FormGroup {
    return this.fb.group({
      id: new FormControl(""),
      name: new FormControl(""),
       quantity: this.fb.control([]),
      action: new FormControl("newRecord"),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }

}
