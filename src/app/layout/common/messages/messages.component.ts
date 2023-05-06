import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { Message } from 'app/layout/common/messages/messages.types';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { UserService } from 'app/core/user/user.service';
import { UsersMailingComponent } from 'app/modules/admin/dashboards/users-mailing/users-mailing.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'app/core/auth/auth.service';

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


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _messagesService: MessagesService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _userService: UserService,
        private dialog: MatDialog,
        private authService:AuthService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to message changes
        this._userService.getAllUsers().subscribe((data) => {
            this.Tabusers = data;
        });
    
    
    }
    open() {
        let UsersEmails=this.Tabusers.map((n)=>n.email)
        console.log(UsersEmails);
        
        const dialogRef = this.dialog.open(UsersMailingComponent, {
          width: "640px",
          disableClose: true,
          data: {usersEmails:UsersEmails},
        });
      }


}
