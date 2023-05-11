import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {notificationServiceUrl} from 'app/core/config/app.config'

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private _httpClient: HttpClient) { }

  get_peak_hours(){
    return this._httpClient.get(notificationServiceUrl+'/analytics/peak-hours')
  }
}
