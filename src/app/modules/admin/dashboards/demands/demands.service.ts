import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {mapServiceUrl} from 'app/core/config/app.config'
import { observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandsService {

  constructor(private _httpClient: HttpClient) { }
  public add_demand(demand,desk_id,user_id){
    const url = `${mapServiceUrl}/service2/add-demand/?desk_id=${desk_id}&user_id=${user_id}`;
  return this._httpClient.post(url, demand);

  }
  public getAllDemands(){
    return this._httpClient.get(mapServiceUrl+'/demands/')
  }
  public getDemand(id){
    return this._httpClient.get(mapServiceUrl+'/demand/'+id)
  }
  public acceptDemand(user_id,desk_id,demandId,material,demands){
return this._httpClient.put(mapServiceUrl+'/acceptDemand/'+desk_id+'/'+user_id+'/'+demandId,{equipements:material,demand:demands})
  }

  public refuseDemand(demand_id,user_id)
  {
    return this._httpClient.put(mapServiceUrl+'/demands/'+demand_id+'/'+user_id,{})
  }
}
