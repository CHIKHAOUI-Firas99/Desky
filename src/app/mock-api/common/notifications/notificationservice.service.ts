import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { mapServiceUrl } from 'app/core/config/app.config';
import { map } from 'rxjs';
var notification=''
@Injectable({
  providedIn: 'root'
})
export class NotificationserviceService {
  private userId: number;
  notifuser: any;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.userId = authService.getCurrentUser().id;
  }

  public getNotification() {
    return this.httpClient.get<any[]>(`${mapServiceUrl}/notification/${this.userId}`).pipe(
      map((result: any[]) => {
        return result.map((notification: any) => {
          return {
            id: notification.id,
            icon: 'heroicons_solid:star',
            title: 'Material Request',
            description: notification.description,
            time: notification.created_at, // You can modify this to format the date/time as needed
            read: false
          };
        });
      })
    );
    
    
     }
     
     
}
