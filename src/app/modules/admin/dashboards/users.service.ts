import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {userManagementUrl} from 'app/core/config/app.config'

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
  isStringOrFile(input: any): boolean {
    if (input instanceof File) {
      return true;
    }
    return false;
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
     return this._httpClient.patch<any>(userManagementUrl+'/admin/update/'+id,u,{
      headers
     })
  }

  deleteUser(id:number):Observable<any>{
    const headers = new HttpHeaders().set('token', ` ${this._authService.accessToken}`);
   
     return this._httpClient.delete<any>(userManagementUrl+'/deleteUser/'+id,{headers})
  }




  getRoleByIdUser(id:number):Observable<any>{

     return this._httpClient.get<any>(userManagementUrl+'/userRole/'+id)
  }
  sendEmails(object):Observable<any>{

    return this._httpClient.post(userManagementUrl+'/sendEmails',object)
 }
}
