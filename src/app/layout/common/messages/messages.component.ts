import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import { Message } from 'app/layout/common/messages/messages.types';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { UserService } from 'app/core/user/user.service';
import { UsersMailingComponent } from 'app/modules/admin/dashboards/users-mailing/users-mailing.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'app/core/auth/auth.service';
import { ClaimsService } from 'app/core/claimsManagement/claims.service';
import { ToastrService } from 'ngx-toastr';
import { log } from 'fabric/fabric-impl';

@Component({
    selector       : 'messages',
    templateUrl    : './messages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'messages'
})
export class MessagesComponent implements OnInit
{


    messages: Message[];
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    Tabusers: any;
    isAdmin: boolean | null = null;
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canSend: any;
    send: boolean=false;
    public canSend$: Observable<boolean>;

    /**
     * Constructor
     */
    constructor(
        private _toastr:ToastrService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _messagesService: MessagesService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _userService: UserService,
        private dialog: MatDialog,
        private authService:AuthService,
    private _claimsService: ClaimsService,
    )
    {
    }
    send$: Observable<boolean>;
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit() {

      this.send$ = this.authService.dispalyAdminDashboard().pipe(
        map((data) => {
          console.log(data, 'haniiiiiiiiiiiii');
  
          let obj = this._claimsService.manageObject(data["details"], "broadcasting");
          return obj["send"];
        })
      );
            
        // Subscribe to message changes
        this._userService.getAllUsers().subscribe((data) => {
          this.Tabusers = data;
        });

      }
    open() {
        console.log(this.send);
        this.authService.dispalyAdminDashboard()
        
        
        .subscribe((data)=>{
            console.log(data,'haniiiiiiiiiiiii');
            
            let obj = this._claimsService.manageObject(data["details"], "broadcasting");
            this.send= obj["send"];
            console.log(this.send);
            
            if (this.send===false) {
                this._toastr.error('you do not have the permission to send any Email')
            }
            else if (this.send===true){   let UsersEmails=this.Tabusers.map((n)=>n.email)
                console.log(UsersEmails);
                
                const dialogRef = this.dialog.open(UsersMailingComponent, {
                  width: "640px",
                  disableClose: true,
                  data: {usersEmails:UsersEmails},
                });
              }
        })
  
     
    }

}
