import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {mapServiceUrl} from 'app/core/config/app.config'

@Injectable({
  providedIn: 'root'
})
export class DemandsService {

  constructor(private _httpClient: HttpClient) { }
  public getAllDemands(){
    return this._httpClient.get(mapServiceUrl+'/demands/')
  }
  public acceptDemand(desk_id,material){
return this._httpClient.put(mapServiceUrl+'/acceptDemand/'+desk_id,material)
  }
  public deleteDemand(desk_id){
    return this._httpClient.delete(mapServiceUrl+'/demands/'+desk_id)
  }
}
