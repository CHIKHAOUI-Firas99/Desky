import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "app/core/auth/auth.service";
import { ClaimsService } from "app/core/claimsManagement/claims.service";
import { RoleService } from "app/core/role/role.service";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { ApexOptions } from "ng-apexcharts";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AddUserComponent } from "../add-user/add-user.component";
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";
import { PhoneComponent } from "../phone/phone.component";
import { UsersService } from "../users.service";
import { hex } from "chroma-js";
import { Router, ActivatedRoute, RouteReuseStrategy } from "@angular/router";
@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  Tabusers: User[] = [];
  idsUser: number;
  data: any;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
  tabRoleNames: Array<String>;
  userRole: String;
  users = new MatTableDataSource<any>();
  isLoading = true;
  pageNumber: number = 1;
  displayPassword = false;
  VOForm: FormGroup = this._formBuilder.group({
    VORows: this._formBuilder.array([]),
  });
  isEditableNew: boolean = true;
  displayedColumns: string[] = [
    "user_id",
    "name",
    "email",
    "phone_number",
    "roles",
    "phone",
    "authorization",
    "action",
  ];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  paginatorList: HTMLCollectionOf<Element>;
  currentIndex: number;
  inUpdate: boolean;
  errMessage: any;
  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy,
    private _usersService: UsersService,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _roleService: RoleService,
    private dialog: MatDialog,
    private _claimsService: ClaimsService,
    private _userService: UserService,
    private toastr: ToastrService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  pageSize: number = 0;
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
      pageIndex: this.paginator.pageIndex + 1,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
    });
    this.getUsers();
  }
  paginationChange(pageEvt: PageEvent) {
    this.length = pageEvt.length;
    this.pageIndex = pageEvt.pageIndex;
    this.pageSize = pageEvt.pageSize;
    this.emitPageEvent(pageEvt);
  }

  showToast(message:string,title:string): void {
   this.toastr.success(message, title);
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
  ngOnInit() {
    this._authService.dispalyAdminDashboard().subscribe((data) => {
      let obj = this._claimsService.manageObject(data["details"], "users");
      this.canAdd = obj["create"];
      this.canEdit = obj["update"];
      this.canDelete = obj["delete"];
    });
    this._roleService
      .getAllRoles()
      .subscribe((data) => (this.tabRoleNames = data));
    this.getUsers();
  }

  openDialog(VOFormElement, index): void {
    const dialogRef = this.dialog.open(PhoneComponent, {
      width: "640px",
      disableClose: true,
      data: this.getPhoneInfo(VOFormElement, index),
    });
  }
   isDarkColor(hexColor: string): boolean {
    // Convert hex color to RGB
    if (hexColor) {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      // Calculate luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // Return true if luminance is less than 0.5 (dark), false otherwise (light)
      return luminance < 0.5;
  
    } else {
      return false
    }
  }
  
  fillFormTab(tab: Array<any>) {
    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        tab
          .filter((user) => user != undefined)
          .map((val) =>
          
            this.fb.group({
              id: new FormControl(val.id),
              name: new FormControl(val.name),
              email: new FormControl(val.email),
              phoneNumber: new FormControl(val.phoneNumber),
              roles: new FormControl(val.role !== null ? val.role : 'None'), 
              color: new FormControl(val.color),
              phone: new FormControl(val.phone),
              authorization: new FormControl(val.authorization),
              action: new FormControl("existingRecord"),
              isEditable: new FormControl(true),
              isNewRow: new FormControl(false),
            })
          )
      ), //end of fb array
    }); // end of form group cretation
    this.isLoading = false;
    this.users = new MatTableDataSource(
      (this.VOForm.get("VORows") as FormArray).controls
    );
  }
  getPhoneInfo(VOFormElement, index) {
    const row = VOFormElement.get("VORows")?.at(index);
    const phone = row?.get("phone")?.value ?? null;
    return phone;
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
  }
  getuserRoles(id: number) {
    this._usersService
      .getRoleByIdUser(id)
      .subscribe((role) => (this.userRole = role));
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
      this.onPaginateChange(this.paginator, this.paginatorList);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
    if (this.users.filter.length > 0) {
      let u = this.Tabusers.filter(
        (n) =>
          n.id.toString().toLowerCase().includes(this.users.filter) ||
          n.email.toLowerCase().includes(this.users.filter) ||
          n.phoneNumber.toLowerCase().includes(this.users.filter) ||
          n.name.toLowerCase().includes(this.users.filter) ||
          n.role.toLowerCase().includes(this.users.filter) ||
          n.authorization.toString().toLowerCase().includes(this.users.filter)
      );
      this.fillFormTab(u);
    } else this.fillFormTab(this.Tabusers);
  }
  AddNewRow() {
    this.displayPassword = true;
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: "640px",
      disableClose: true,
      data: { roles: this.tabRoleNames },
    });
  }
  EditSVO(VOFormElement, i) {
    VOFormElement.get("VORows").at(i).get("isEditable").patchValue(false);
    this.inUpdate=true
  }
  getRoles(VOFormElement, index: number) {
    const row = VOFormElement.get("VORows")?.at(index);
    const roles = row?.get("roles")?.value ?? null;
    return roles;
  }
  delete(VOFormElement, index: number) {
    const row = VOFormElement.get("VORows")?.at(index);
    const id = row?.get("id")?.value ?? null;
    this.dialog.open(DeleteConfirmationComponent, {
      width: "640px",
      disableClose: true,
      data: {
        iduser: id,
        object:'user',
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
    const user = {
      name: row.get("name").value,
      email: row.get("email").value,
      phoneNumber: row.get("phoneNumber").value,
      role: row.get("roles").value,
      authorization: row.get("authorization").value,
    };
    if (id) 
    {
      this._usersService.updateUser(id, user).subscribe(()=>{
        this.showToast('User updated','success');
        this.inUpdate=false
      this.refreshRoute()
      },(err)=>{
        console.log(err);
        this.errMessage=err["error"]["detail"]
        this.CancelSVO(this.VOForm,i)
        this.toastr.error(this.errMessage, 'Failed');
        
      }) 
      
    } 
    else 
    {
      this._authService.signUp(user).subscribe(() => {
        this.getUsers();
      });
    }
    VOFormElement.get("VORows").at(i).get("isEditable").patchValue(true);
  }
  CancelSVO(VOFormElement, i) {
    const row = VOFormElement.get("VORows").at(i);
    let id = row.get("id").value;
    if (!id) {
      this.fillFormTab(this.Tabusers);
    }
    row.get("name").patchValue(this.Tabusers[i].name);
    row.get("email").patchValue(this.Tabusers[i].email);
    row.get("phoneNumber").patchValue(this.Tabusers[i].phoneNumber);
    row.get("authorization").patchValue(this.Tabusers[i].authorization);
    row.get("isEditable").patchValue(true);
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
      email: new FormControl(""),
      phoneNumber: new FormControl(""),
      roles: new FormControl(""),
      authorization: new FormControl(""),
      action: new FormControl("newRecord"),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }
}
