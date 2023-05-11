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
  public acceptDemand(user_id,desk_id,demandId,material,demands){
return this._httpClient.put(mapServiceUrl+'/acceptDemand/'+desk_id+'/'+user_id+'/'+demandId,{equipements:material,demand:demands})
  }

  public deleteDemand(user_id,demand_id)
  {
    return this._httpClient.delete(mapServiceUrl+'/demands/'+demand_id+'/'+user_id)
  }
}
