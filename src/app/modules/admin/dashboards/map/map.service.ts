import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private _httpClient: HttpClient) { }



  addWorkspace(w:any):Observable<any>{    
    return this._httpClient.post<any>('http://localhost:8080/workspace', w);
  }

  getWorkspacesNames():Observable<any>{
    return this._httpClient.get<any>('http://localhost:8080/workspaces_names')
  }

  getWorkspace(name:any):Observable<any>{
    return this._httpClient.get<any>('http://localhost:8080/workspace',{
      params: new HttpParams().set('name', name)
    })
  }

  updateWorkspace(w:any):Observable<any>{
    console.log(w.name);
    
    return this._httpClient.put<any>('http://localhost:8080/workspace/'+w.name,w)
  }

}
