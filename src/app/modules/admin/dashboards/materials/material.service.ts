import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {mapServiceUrl} from 'app/core/config/app.config'

@Injectable({
  providedIn: 'root'
})

export class MaterialService {
  imageUrl: string;
  picUrl: any;

  constructor(private _httpClient: HttpClient) { }
  public addMat(mat){
    return this._httpClient.post(mapServiceUrl+'/materials',mat)
  }
  public getMat(id){
      return   this._httpClient.get<any>(`${mapServiceUrl}/materials/${id}`) 
  }
  getImageUrl(picture: any) {
    const blob = new Blob([picture], { type: 'image/jpeg' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      this.imageUrl = reader.result as string;
    };
  }
}
