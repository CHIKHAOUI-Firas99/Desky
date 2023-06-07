import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {notificationServiceUrl} from 'app/core/config/app.config'

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private _httpClient: HttpClient) { }

  get_peak_hours(){
    return this._httpClient.get(notificationServiceUrl+'/analyseNotificationService/analytics/peak-hours')
  }
  get_reservation_by_date(){
    return this._httpClient.get(notificationServiceUrl+'/analyseNotificationService/analytics/reservation-by-date')
  }
  most_common_equipements(){
    return this._httpClient.get(notificationServiceUrl+'/analyseNotificationService/analytics/most_common_equipment')
  }
  get_rerservations_status(){
    return this._httpClient.get(notificationServiceUrl+'/analyseNotificationService/analytics/reservations_status')
  }
  get_office_remote_analyse(){
    return this._httpClient.get(notificationServiceUrl+'/analyseNotificationService/analytics/office_remote_work')

  }
  get_desk_usage(){
    return this._httpClient.get(notificationServiceUrl+'/analyseNotificationService/analytics/desk-usage')
  }
}
