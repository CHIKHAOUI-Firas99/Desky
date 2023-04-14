import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {mapServiceUrl} from 'app/core/config/app.config'
import { Observable } from 'rxjs';
import { Material } from './material';

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
  public getPictureUrl(picture: string): string {
    // Decode the base64-encoded picture
    const decodedPicture = atob(picture);
    
    // Construct the data URL for the picture
    const dataUrl = `data:image/jpeg;base64,${decodedPicture}`;
    
    return dataUrl;
  }
 public  getAllMaterials(){
    return this._httpClient.get(mapServiceUrl+'/materials')
  }
  updateMaterial(materialId: number, material: Material, picture?: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', material.name);
    formData.append('quantity', material.quantity.toString());
    formData.append('desk_id', material.desk_id.toString());
    if (this.isStringOrFile(picture)) {
     
      formData.append('picture', picture);
    }
// console.log(formData.get('picture'));

    return this._httpClient.put(`${mapServiceUrl}/materials/${materialId}`, formData);
  }
  deleteMat(id:number){
    return this._httpClient.delete(mapServiceUrl+'/materials/'+id)
  }
  isStringOrFile(input: any): boolean {
    if (input instanceof File) {
      return true;
    }
    return false;
  }
}
