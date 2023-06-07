import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable } from 'rxjs';
import {mapServiceUrl} from 'app/core/config/app.config'
import {userManagementUrl} from 'app/core/config/app.config'

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private _httpClient: HttpClient,private _AuthService:AuthService) { }

  getWorkspaceForBook(name:any,date:any):Observable<any>{
    let userId = this._AuthService.getCurrentUser().id;
    return this._httpClient.get<any>(mapServiceUrl+'/mapService/workspaceToBook',{
      params: new HttpParams()
      .set('name', name)
      .set('date', date)
      .set('userId',userId)
    })
  }

  getWorkspacesNames():Observable<any>{
    return this._httpClient.get<any>(mapServiceUrl+'/mapService/workspaces_names')
  }

  getWorkspacesForBooking(date:any):Observable<any>{
    let userId = this._AuthService.getCurrentUser().id;
    return this._httpClient.get<any>(mapServiceUrl+'/mapService/workspaces?date='+`${date}`+'&userId='+`${userId}`)
  }


  addReservation(data:any):Observable<any>{
    return this._httpClient.post<any>(mapServiceUrl+'/mapService/reservation',data)

  }

  get_available_time_slots(desk_id,date):Observable<any>{
    return this._httpClient.get<any>(mapServiceUrl+'/mapService/get_available_time_slots/'+desk_id+'/'+date)

  }
  // reservationsPerDeskPerDay
  getReservationsPerDeskPerDay(desk_id,date):Observable<any>{
    return this._httpClient.get<any>(mapServiceUrl+'/mapService/reservationsPerDeskPerDay/'+desk_id+'/'+date)

  }

  getUserTags(){
    let userId = this._AuthService.getCurrentUser().id;
    return this._httpClient.get<any>(userManagementUrl+'/service1/tags/'+userId)
  }

}
