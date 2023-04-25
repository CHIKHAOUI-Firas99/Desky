import { Component, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ClaimsService } from 'app/core/claimsManagement/claims.service';
import { RoleService } from 'app/core/role/role.service';
import { Role } from 'app/core/role/role.types';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AddMaterialComponent } from '../add-material/add-material.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MaterialService } from '../materials/material.service';
import { DemandsService } from './demands.service';

@Component({
  selector: 'app-demands',
  templateUrl: './demands.component.html',
  styleUrls: ['./demands.component.scss']
})
export class DemandsComponent {
  groups: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  TabMaterials: any;
  idsUser: any;
  data: any;
  tabRoleNames: Array<Role>;
  userRole: String;
  materials = new MatTableDataSource<any>();
  isLoading = true;
  pageNumber: number = 1;
  displayPassword = false;
  VOForm: FormGroup = this._formBuilder.group({
    VORows: this._formBuilder.array([]),
  });
  isEditableNew: boolean = true;
  displayedColumns: string[] = ["desk_id", "user_id", "demands","equipements","demandDate", "action"];
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
    private _DemandsService:DemandsService

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
    this.materials.filter = filterValue.trim().toLowerCase();
    
    if (this.materials.filter.length > 0) {
      let u = this.TabMaterials.filter(
        (n) =>
          n.id.toString().toLowerCase().includes(this.materials.filter) ||
          n.name.toLowerCase().includes(this.materials.filter)||
          n.quantity.toString().toLowerCase().includes(this.materials.filter)
      );
      this.fillFormTab(u);
    } else this.fillFormTab(this.TabMaterials);
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
    const data = this.TabMaterials.slice(startIndex, endIndex);
    this.fillFormTab(data);
  }
  
  goToPage() {
    this.paginator.pageIndex = this.pageNumber - 1;
    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex + 1,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
    });
    this.getRoles();
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
  async ngOnInit(): Promise<void> {
    try {
      this.getRoles()
      this._authService.dispalyAdminDashboard().subscribe((data) => {
        let obj = this._claimsService.manageObject(data["details"], "materials");
        this.canAdd = obj["create"];
        this.canEdit = obj["update"];
        this.canDelete = obj["delete"];
      });
    } catch (err) {
      console.log(err);
    }
  }



tags:Array<any>=[]



 fillFormTab(tab: Array<any>) {
  try {
    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        tab
          .filter((role) => role != undefined)
          .map( (val) => {
            //--------------CLAIMS----------------//
          
            return  this.fb.group({
              desk_id: new FormControl(val.desk_id),
              user_id: new FormControl(val.user_id),
              demands: new FormControl(val.demands),
              equipements: new FormControl(val.equipements),
              demandDate:new FormControl(val.demandDate),
              action: new FormControl("existingRecord"),
              isEditable: new FormControl(true),
              isNewRow: new FormControl(false),
            });
          })
      ),
    });
    
    this.isLoading = false;
    this.materials = new MatTableDataSource(
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




  async getRoles() {
    try {
      const data = await this._DemandsService.getAllDemands().toPromise();
      this.TabMaterials = data;
      this.fillFormTab(this.TabMaterials);
      this.materials.paginator = this.paginator;
      const filterPredicate = this.materials.filterPredicate;
      this.materials.filterPredicate = (data: AbstractControl, filter) => {
        return filterPredicate.call(this.materials, data.value, filter);
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
    this.materials = new MatTableDataSource(control.controls);
  }
  EditSVO(VOFormElement, i) {
    VOFormElement.get("VORows").at(i).get("isEditable").patchValue(false);
    this.inUpdate=true
  }
  delete(VOFormElement, index: number) {
    const row = VOFormElement.get("VORows")?.at(index);
    const id = row?.get("id")?.value ?? null;
    this.dialog.open(DeleteConfirmationComponent, {
      width: "640px",
      disableClose: true,
      data: {
        idmat: id,
        object:'role',
        message: "Are you sure want to delete?",
        buttonText: {
          ok: "Save",
          cancel: "No",
        },
      },
    });
  }
 




  SaveVO(VOFormElement, i) {
    const row = VOFormElement.get("VORows").at(i);
    const id = row.get("id").value;
  
    if (id) {
      const pictureElement = row.get("picture");
   
        
        const material = {
          
          name: row.get("name").value,
          picture: row.get("picture").value,
          quantity: row.get("quantity").value,
          desk_id: 1
        };
        // const pictureFile = this.base64ToFile(material.picture, 'material-picture', 'image/jpg');


        
        this._materialService.updateMaterial(id, material,material.picture).subscribe((data) => {
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


    

  openDialog(): void {
    const dialogRef = this.dialog.open(AddMaterialComponent, {
      width: "640px",
      disableClose: true,
      data: { tabclaims: this.allclaims ,tabtags:this.allTags},
    });
    
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(VOFormElement, i) {
    const row = VOFormElement.get("VORows").at(i);

    let id = row.get("id").value;
    if (!id) {
      this.fillFormTab(this.TabMaterials);
    }

    row.get("name").patchValue(this.TabMaterials[i].name);
    row
      .get("name")
      .patchValue(
        this.VOForm.get("VORows").value[i].name
      );
      console.log(      this.VOForm.get("VORows").value[i].name);
      
      row
      .get("quantity")
      .patchValue(
        this.TabMaterials[i].quantity
      );
      row
      .get("picture")
      .patchValue(
        this.getPictureUrl(this.TabMaterials[i].picture) 
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
