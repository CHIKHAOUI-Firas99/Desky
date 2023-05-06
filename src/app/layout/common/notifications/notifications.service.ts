import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { mapServiceUrl,notificationServiceUrl } from 'app/core/config/app.config';
import { create, update } from 'lodash';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService
{
    private _notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);
    userId: any;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,private authService:AuthService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notification[]>
    {this.userId = this.authService.getCurrentUser().id;
        return this._httpClient.get<any[]>(`${mapServiceUrl}/notification/${this.userId}`).pipe(
            map((result: any[]) => {
              return result.map((notification: any) => {
                console.log(notification);
                
                return {
                  id: notification.id,
                  icon: 'heroicons_solid:star',
                  title: notification.title,
                  description: notification.description,
                  time: notification.time, // You can modify this to format the date/time as needed
                  read: notification.read
                };
              });
            })
          );
          
          
           }
    

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all notifications
     */
    getAll(): Observable<Notification[]>
    {
        console.log('get all notification function');
        
        return this._httpClient.get<Notification[]>('api/common/notifications').pipe(
            tap((notifications) => {
                this._notifications.next(notifications);
            })
        );
    }

    /**
     * Create a notification
     *
     * @param notification
     */
    create(notification: Notification): Observable<Notification>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.post<Notification>('api/common/notifications', {notification}).pipe(
                map((newNotification) => {

                    // Update the notifications with the new notification
                    this._notifications.next([...notifications, newNotification]);

                    // Return the new notification from observable
                    return newNotification;
                })
            ))
        );
    }

    /**
     * Update the notification
     *
     * @param id
     * @param notification
     */
    update(id: string, notification: Notification)
    {
        return this._httpClient.put(notificationServiceUrl+'/read_notification/'+id,notification)
    }

    /**
     * Delete the notification
     *
     * @param id
     */
    delete(id)
    {
        return   this._httpClient.delete(`${notificationServiceUrl}/notification/${id}`)
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead()
    {
        return this._httpClient.get(notificationServiceUrl+'/read_notifications/')
    }
}
