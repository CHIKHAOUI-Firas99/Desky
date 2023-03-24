import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
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
import { Subject } from "rxjs";
import { AddRoleComponent } from "../add-role/add-role.component";
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";

@Component({
  selector: "app-Roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
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
  displayedColumns: string[] = ["Role_id", "name", "claims", "action"];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  paginatorList: HTMLCollectionOf<Element>;
  currentIndex: any;
  claims: any;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
  /**
   * Constructor
   */
  constructor(
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _roleService: RoleService,
    private _RoleService: RoleService,
    private dialog: MatDialog,
    private _claimsService: ClaimsService
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
    console.log(this.roles.filter);
    
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
  ngOnInit() {
    this._authService.dispalyAdminDashboard().subscribe((data) => {
      console.log(data["details"]);
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
    this.getRoles();
  }
  modelGroup = [];
  evthgrp = [];
  modelgrp = [];
  fillFormTab(tab: Array<Role>) {
    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        tab
          .filter((user) => user != undefined)
          .map((val) => {
            let objtransfered = this._RoleService.transformObject(val.claims);
            let m = objtransfered[0];
            this.evthgrp.push(objtransfered[2]);
            this.groups.push(objtransfered[1]);
            m.forEach((element) => {
              if (!this.modelgrp.includes(element)) {
                this.modelgrp.push(element);
              }
            });
            return this.fb.group({
              id: new FormControl(val.id),
              name: new FormControl(val.name),
              claims: new FormControl(m),
              action: new FormControl("existingRecord"),
              isEditable: new FormControl(true),
              isNewRow: new FormControl(false),
            });
          })
      ),
    });
    console.log(this.modelgrp);
    this.isLoading = false;
    this.roles = new MatTableDataSource(
      (this.VOForm.get("VORows") as FormArray).controls
    );
  }
  getInitialClaims(claims: any): number[] {
    console.log(this.claims);
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
  }
  delete(VOFormElement, index: number) {
    const row = VOFormElement.get("VORows")?.at(index);
    const id = row?.get("id")?.value ?? null;
    this.dialog.open(DeleteConfirmationComponent, {
      width: "640px",
      disableClose: true,
      data: {
        idrole: id,
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
    console.log(this.VOForm.value);
    const row = VOFormElement.get("VORows").at(i);
    const id = row.get("id").value;
    let tabValidatedClaims = [];
    const validatedClaims = row.get("claims").value;
    validatedClaims.forEach((element) => {
      let obj = "";
      const t = this.allclaims.find((n) =>
        n["items"].find((item) => item["value"] === element)
      );
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
    const role = {
      name: row.get("name").value,
      claims: tabValidatedClaims,
    };
    if (id) {
      this._RoleService.updateRole(id, role).subscribe((data) => {
        console.log(role);
      });
    } else {
      this._authService.signUp(role).subscribe(() => {
        this.getRoles();
      });
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: "640px",
      disableClose: true,
      data: { tabclaims: this.allclaims },
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
    console.log(this.TabRoles[i].claims);

    row
      .get("claims")
      .patchValue(
        this._RoleService.transformObject(this.TabRoles[i].claims)[0]
      );

    row.get("isEditable").patchValue(true);
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
