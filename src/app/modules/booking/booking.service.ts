import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private _httpClient: HttpClient) { }

  getWorkspaceForBook(name:any,date:any):Observable<any>{
    return this._httpClient.get<any>('http://localhost:8080/workspaceToBook',{
      params: new HttpParams()
      .set('name', name)
      .set('date', date)
    })
  }

  getWorkspacesNames():Observable<any>{
    return this._httpClient.get<any>('http://localhost:8080/workspaces_names')
  }

  getWorkspacesForBooking(date:any):Observable<any>{
    return this._httpClient.get<any>('http://localhost:8080/workspaces?date='+`${date}`)
  }
}