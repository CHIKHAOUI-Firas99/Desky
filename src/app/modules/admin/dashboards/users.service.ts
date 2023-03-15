import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {Url} from 'app/core/config/app.config'

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  private _data: BehaviorSubject<any> = new BehaviorSubject(null);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient,private _authService:AuthService)
  {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for data
   */
  get data$(): Observable<any>
  {
      return this._data.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get data
   */
  getData(): Observable<any>
  {
      return this._httpClient.get('api/dashboards/finance').pipe(
          tap((response: any) => {
              this._data.next(response);
          })
      );
  }
  updateUser(id:number,u:any):Observable<any>{
      const headers = new HttpHeaders().set('token', ` ${this._authService.accessToken}`);
     return this._httpClient.patch<any>(Url+'/admin/update/'+id,u,{
      headers
     })
  }

  deleteUser(id:number):Observable<any>{
    const headers = new HttpHeaders().set('token', ` ${this._authService.accessToken}`);
   
     return this._httpClient.delete<any>(Url+'/deleteUser/'+id,{headers})
  }




  getRoleByIdUser(id:number):Observable<any>{

     return this._httpClient.get<any>(Url+'/userRole/'+id)
  }
}
