import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {mapServiceUrl} from 'app/core/config/app.config'

@Injectable({
  providedIn: 'root'
})
export class ReservationserviceService {

  constructor(private _httpClient: HttpClient) { }
  public get_user_reservations(id)
  {
    return this._httpClient.get(mapServiceUrl+'/service2/getUserReservations/'+id)
  }
  public get_all_reservations(){
    return this._httpClient.get(mapServiceUrl+'/service2/getAllReservations/')

  }
  cancel_reservation(userId: string, deskId: string, date: string, startTime: string, endTime: string) {
    const queryParams = new URLSearchParams({
        userId: userId,
        deskId: deskId,
        date: date,
        startTime: startTime,
        endTime: endTime
    });

    const url = `${mapServiceUrl}/service2/cancel-reservation/`;

    // Make your HTTP request with the constructed URL
  return   this._httpClient.put(url, {
    userId: userId,
    deskId: deskId,
    date: date,
    startTime: startTime,
    endTime: endTime
})

}

}
