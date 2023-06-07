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
    return this._httpClient.post<any>(mapServiceUrl+'/mapService/workspace', w);
  }

  getWorkspacesNames():Observable<any>{
    return this._httpClient.get<any>(mapServiceUrl+'/mapService/workspaces_names')
  }
  deleteworkspace(id:number){
    return this._httpClient.delete<any>(mapServiceUrl+'/mapService/workspace/'+id)
  }
  updatedeskDetails(desk: any, name: string, action: string) {
    const params = new HttpParams().set('action', action);
    return this._httpClient.put<any>(`${mapServiceUrl}/mapService/update_desk/${name}`, desk, { params });
  }
  getDeskMatTags(desk_id){
    return this._httpClient.get<any>(mapServiceUrl+'/mapService/getDeskMatTags/'+desk_id)
  }
  

  getWorkspace(name:any):Observable<any>{
    return this._httpClient.get<any>(mapServiceUrl+'/mapService/workspace',{
      params: new HttpParams().set('name', name)
    })
  
  }

  updateWorkspace(id:number,w):Observable<any>{
    
    
    return this._httpClient.put<any>(mapServiceUrl+'/mapService/workspace/'+id,w)
  }
  getSelectedObjectInfo(id:number){
    return this._httpClient.get(mapServiceUrl+'/mapService/object/'+id)
      
  }

}
