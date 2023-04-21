import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {mapServiceUrl} from 'app/core/config/app.config'

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private _httpClient: HttpClient) { }



  addWorkspace(w:any):Observable<any>{    
    return this._httpClient.post<any>(mapServiceUrl+'/workspace', w);
  }

  getWorkspacesNames():Observable<any>{
    return this._httpClient.get<any>(mapServiceUrl+'/workspaces_names')
  }
  deleteworkspace(id:number){
    return this._httpClient.delete<any>(mapServiceUrl+'/workspace/'+id)
  }

  getWorkspace(name:any):Observable<any>{
    return this._httpClient.get<any>(mapServiceUrl+'/workspace',{
      params: new HttpParams().set('name', name)
    })
  
  }

  updateWorkspace(id:number,w):Observable<any>{
    
    
    return this._httpClient.put<any>(mapServiceUrl+'/workspace/'+id,w)
  }
  getSelectedObjectInfo(id:number){
    return this._httpClient.get(mapServiceUrl+'/object/'+id)
      
  }

}
