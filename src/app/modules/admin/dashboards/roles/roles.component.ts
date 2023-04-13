import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { trigger, transition, style, animate } from '@angular/animations';
const slideFromTop = trigger('slideFromTop', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('300ms ease-out', style({ transform: 'translateY(0%)' })),
  ]),
  transition(':leave', [
    animate('300ms ease-out', style({ transform: 'translateY(-100%)' })),
  ]),
]);
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "app/core/auth/auth.service";
import { ClaimsService } from "app/core/claimsManagement/claims.service";
import { RoleService } from "app/core/role/role.service";
import { Role } from "app/core/role/role.types";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AddRoleComponent } from "../add-role/add-role.component";
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TagsUpdateComponent } from "../tags-update/tags-update.component";
import { log } from "fabric/fabric-impl";
import { ActivatedRoute, RouteReuseStrategy, Router } from "@angular/router";

@Component({
  selector: "app-Roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
  animations: [slideFromTop]
})
export class RolesComponent implements ControlValueAccessor {
  groups: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  TabRoles: Role[] = [];
  idsUser: any;
  data: any;
  tabRoleNames: Array<Role>;
  userRole: String;
  roles = new MatTableDataSource<any>();
  isLoading = true;
  pageNumber: number = 1;
  displayPassword = false;
  VOForm: FormGroup = this._formBuilder.group({
    VORows: this._formBuilder.array([]),
  });
  isEditableNew: boolean = true;
  displayedColumns: string[] = ["Role_id", "name", "claims","tags", "action"];
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
  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _roleService: RoleService,
    private _RoleService: RoleService,
    private dialog: MatDialog,
    private _claimsService: ClaimsService,
    private toastr: ToastrService

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
    this.roles.filter = filterValue.trim().toLowerCase();
    
    if (this.roles.filter.length > 0) {
      let u = this.TabRoles.filter(
        (n) =>
          n.id.toString().toLowerCase().includes(this.roles.filter) ||
          
          n.name.toLowerCase().includes(this.roles.filter)||
          n.claims.toString().toLowerCase().includes(this.roles.filter)
      );
      this.fillFormTab(u);
    } else this.fillFormTab(this.TabRoles);
  }
  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    const data = this.TabRoles.slice(startIndex, endIndex);
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
  emitPageEvent(pageEvent: PageEvent) {
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
  ngOnInit() {
     
    
    this._authService.dispalyAdminDashboard().subscribe((data) => {
      let obj = this._claimsService.manageObject(data["details"], "roles");
      this.canAdd = obj["create"];
      this.canEdit = obj["update"];
      this.canDelete = obj["delete"];
    });
    this._roleService.getAll().subscribe((data) => {
      this.tabRoleNames = data;
    });
    this._roleService.getAllClaims().subscribe((data) => {
      this.allclaims = this._roleService.transformObject(data)[2];
    });
    this._roleService.getAllTags().subscribe((data)=>{
      this.allTags=data
      console.log(this.allTags);
      
    })

    
    this.getRoles();
  }
  modelGroup = [];
  evthgrp = [];
  modelgrp = [];

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
tags:Array<any>=[]

fillFormTab(tab: Array<Role>) {
   // move initialization outside of .map() function
  this.VOForm = this.fb.group({
    VORows: this.fb.array(
      tab
        .filter((role) => role != undefined)
        .map((val) => {
          //--------------CLAIMS----------------//
          let objtransfered = this._RoleService.transformObject(val.claims);
          let m = objtransfered[0];
          this.evthgrp.push(objtransfered[2]);
          this.groups.push(objtransfered[1]);
          m.forEach((element) => {
            if (!this.modelgrp.includes(element))
            {
              this.modelgrp.push(element);
            }
          });

          //----------------TAGS---------------------//
          
          let tagsValues = [];
          
          let rowTags = val.tags ? this.transformArray(val.tags) : [];
          console.log(rowTags);
          
          this.tags.push(rowTags)
          
          for (let i = 0; i < rowTags.length; i++) {
            const element = rowTags[i];
            
           
              if (!tagsValues.includes(element.id)) 
              {
                tagsValues.push(element.id);
              }
            ;
          }
console.log(tagsValues);

          return this.fb.group({
            id: new FormControl(val.id),
            name: new FormControl(val.name),
            color:new FormControl(val.color),
            claims: new FormControl(m),
            tags: new FormControl(tagsValues),
            action: new FormControl("existingRecord"),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          });
        })
    ),
  });
  this.isLoading = false;
  this.roles = new MatTableDataSource(
    (this.VOForm.get("VORows") as FormArray).controls
  );
  console.log(this.tags);
  
}

transformArray(arr: { key: string; value: string[] }[]): any {
  return arr.map((elem) => ({
    key: elem.key,
    value: elem.value,
    id: `value-${elem.key}`
    }))

}
  getInitialClaims(claims: any): number[] {
    const selectedClaims = [];
    const allClaims = { ...this.claims };
    Object.keys(claims).forEach((key) => {
      const claim = allClaims[key];
      if (claim) {
        const index = this.claims.indexOf(claim);
        if (index >= 0) {
          selectedClaims.push(index);
        }
      }
    });
    return selectedClaims;
  }
  getRoles() {
    this._roleService.getAll().subscribe((data) => {
      this.TabRoles = data;
      this.fillFormTab(this.TabRoles);
      this.roles.paginator = this.paginator;
      const filterPredicate = this.roles.filterPredicate;
      this.roles.filterPredicate = (data: AbstractControl, filter) => {
        return filterPredicate.call(this.roles, data.value, filter);
      };
    });
  }
  /**
   * After view init
   */
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
    this.roles = new MatTableDataSource(control.controls);
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
        idrole: id,
        object:'role',
        message: "Are you sure want to delete?",
        buttonText: {
          ok: "Save",
          cancel: "No",
        },
      },
    });
  }
  getObjectNames(tab: Array<any>) {
    let objects = [];
    tab.forEach((element) => {
      objects.push(element["name"]);
    });
    return objects;
  }
  SaveVO(VOFormElement, i) {
    const row = VOFormElement.get("VORows").at(i);
    const id = row.get("id").value;
    let tabValidatedClaims = [];
    const validatedClaims = row.get("claims").value;
    
    validatedClaims.forEach((element) => {
      let obj = "";
      const t = this.allclaims.find((n) =>
      n["items"] && n["items"].find((item) => item["value"] === element)
    );
    const elm = t && t["items"] && t["items"].find((e) => e["value"] === element);
    
    if (elm) {
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
    } else {
    }
    

    });
    
    let tab = this.getObjectNames(this.evthgrp[i]);
    let validatedclaimesobjects = [];
    tabValidatedClaims.forEach((elm) => {
      validatedclaimesobjects.push(elm["object"]);
    });
    tab.forEach((key) => {
      if (!validatedclaimesobjects.includes(key)) {
        tabValidatedClaims.push({ object: key, rights: "" });
      }
    });
    console.log(this.tags[i]);
    console.log(this.updatedTag);
    var transformedArr = []
    if (this.updatedTag) {
      transformedArr=this.getYourTags(this.updatedTag)
    }
    else{
      transformedArr=this.getYourTags(this.tags[i])
    }
    
    console.log(transformedArr);
    
    const role = {
      name: row.get("name").value,
      claims: tabValidatedClaims,
      tags:transformedArr
    };
    if (id) {
      
      this._RoleService.updateRole(id, role).subscribe((data) => {
        this.showToast('role updated','success')
        localStorage.removeItem('ckeckedids')
        localStorage.removeItem('tagsArr')
        this.refreshRoute()
      },(err)=>{
        console.log(err);
        this.errMessage=err["error"]["detail"]
        this.CancelSVO(this.VOForm,i)
        this.toastr.error(this.errMessage, 'Failed');
        
      }
      );
    } else {
      this._authService.signUp(role).subscribe(() => {
        this.getRoles();
      });
    }
    VOFormElement.get("VORows").at(i).get("isEditable").patchValue(true);
this.inUpdate=false
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
getYourTags(arr) {
    const transformedArr = [];
    for (let obj of arr) {
      if (obj.key.length > 0 && obj.value.length > 0) {
        transformedArr.push({ key: obj.key, value: obj.value });
      }
    }
    return transformedArr;
  }
showToast(message:string,title:string): void {
    this.toastr.success(message, title);
   }
mergeArrays(arr1, arr2) {
    return arr1.map((obj1) => {
      let v=''
      const matchingObj2 = arr2.find((obj2) => {
         v=obj1.value        
      return obj2.key == obj1.key});
      if (matchingObj2) {
        return { key: obj1.key, value: v };
      } else {
        return obj1;
      }
    }).concat(arr2.filter((obj2) => !arr1.find((obj1) => obj1.key === obj2.key)));}


    
updatedTag:any
   open(tagOptions: any[], selectedValues: any[],i) {
    let nb=this.i
    this.i=i
if (this.i!=nb) {
  this.mytags=this.tags[i]
}
  
  
   
  console.log(this.tags[i]);
    
 
  
   let t= this.dialog.open(TagsUpdateComponent, {
    
      data: { alltags: this.mytags ?this.mytags:this.tags[i],selectedOptions:selectedValues }
    })
    t.afterClosed().subscribe(result => {
      if (result) {
        console.log(this.allTags);
        
        console.log('The dialog was closed', );
        this.mytags=result[1]
        console.log(this.mytags);
        this.updatedTag=result[1]
        // this.VOForm.get("VORows").value[i].tags=result[0]
        console.log(this.VOForm.get("VORows").value[i].tags);
        
        console.log(this.tags);
      }
     
      
    });
  }
  
  
   transformObject(inputObj: { [key: string]: any[] }): { key: string; value: any[] }[] {
    const outputArray = [];
  
    for (const key in inputObj) {
      if (Object.prototype.hasOwnProperty.call(inputObj, key)) {
        const value = inputObj[key];
        const outputObject = {
          key: key,
          value: value,
        };
        outputArray.push(outputObject);
      }
    }
  
    return outputArray;
  }
  

  objectOfTags(tab: Array<string>): { key: string, value: any[] }[] {
    const result = [];
 let tb: Array<any>=[]
 tb.push(this.allTags)
  this.allTags=this.transformObject(this.allTags);
  
    this.allTags.forEach(tag => {
      const tagValues = tag.value.data.filter(elm => tab.includes(elm.id)).map(elm => elm.value);
  
      if (tagValues.length > 0) {
        const existingTag = result.find(obj => obj.key === tag.key);
  
        if (existingTag) {
          existingTag.value.push(...tagValues);
        } else {
          result.push({ key: tag.key, value: tagValues });
        }
      }
    });
  
    return result;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddRoleComponent, {
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
      this.fillFormTab(this.TabRoles);
    }

    row.get("name").patchValue(this.TabRoles[i].name);
    let m = [];

    row
      .get("claims")
      .patchValue(
        this._RoleService.transformObject(this.TabRoles[i].claims)[0]
      );
  row
      .get("tags")
      .patchValue(
        this.VOForm.get("VORows").value[i].tags
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
      claims: this.fb.control([]),
      action: new FormControl("newRecord"),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }
}
