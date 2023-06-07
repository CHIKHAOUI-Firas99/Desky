import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from './role.types';
import {userManagementUrl} from 'app/core/config/app.config'

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private _httpClient:HttpClient) { }

  getAllRoles(): Observable<Array<String>>
  {
      return this._httpClient.get<Array<String>>(userManagementUrl+"/userManagementService/role/getAllRolesNames")
  }
  getAll(): Observable<Array<Role>>
  {
      return this._httpClient.get<Array<Role>>(userManagementUrl+"/userManagementService/roles")
  }
  getAllClaims(): Observable<Array<any>>
  {
      return this._httpClient.get<Array<any>>(userManagementUrl+"/userManagementService/claims/")
  }
  getAllTags():Observable<Array<any>>{
    return this._httpClient.get<Array<any>>(userManagementUrl+"/userManagementService/alltags/")
  }
  updateRole(id,role):Observable<Role>{
   return  this._httpClient.put<Role>(userManagementUrl+"/userManagementService/updateRole/"+id,role)
  }
  addRole(role){
    return this._httpClient.post<Role>(userManagementUrl+'/userManagementService/addRole',role)
  }
  deleteRole(id){
    return  this._httpClient.delete(userManagementUrl+"/userManagementService/deleteRole/"+id)
   }

  transformObject(tab) {
    console.log(tab,'tabbbbbbbbbbbbb');
    
    let m = [];
    let grp = [];
    let groups=[]
    tab.forEach(element => {
      console.log(element);
      
      let obj = element['object'];
      let rights = element['rights'];
      
      let claim = { "name": obj, "items": [] };
  if (obj =="broadcasting") {
    if (rights.includes('c')){
      claim['items'].push({
        "test": "true",
        "label": "Email broadcasting",
        "value": "can_create_" + obj
      });
    }else{
      claim['items'].push({
        "test": "false",
        "label": "Email broadcasting",
        "value": "can_create_" + obj
      });
    }

    ;
  }
    else if (obj !="broadcasting"){  
      if (rights.includes('c')) {
        claim['items'].push({
          "test": "true",
          "label": "can create",
          "value": "can_create_" + obj
        });
      } else {
        claim['items'].push({
          "test": "false",
          "label": "can create",
          "value": "can_create_" + obj
        });
      }
  
      if (rights.includes('r')) {
        claim['items'].push({
          "test": "true",
          "label": "can read",
          "value": "can_read_" + obj
        });
      } else {
        claim['items'].push({
          "test": "false",
          "label": "can read",
          "value": "can_read_" + obj
        });
      }
  
      if (rights.includes('u')) {
        claim['items'].push({
          "test": "true",
          "label": "can update",
          "value": "can_update_" + obj
        });
      } else {
        claim['items'].push({
          "test": "false",
          "label": "can update",
          "value": "can_update_" + obj
        });
      }
  
      if (rights.includes('d')) {
        claim['items'].push({
          "test": "true",
          "label": "can delete",
          "value": "can_delete_" + obj
        });
      } else {
        claim['items'].push({
          "test": "false",
          "label": "can delete",
          "value": "can_delete_" + obj
        });
      }}
  groups.push(claim)
      grp.push(claim);
    });
  
    // Loop through each claim in grp
    for (let i = 0; i < grp.length; i++) {
      let claim = grp[i];
      let items = claim['items'];
  
      // Check if any item in the claim has 'test' set to true
      let hasTrue = false;
      for (let j = 0; j < items.length; j++) {
        let item = items[j];
        if (item['test'] == 'true') {
          hasTrue = true;
          break;
        }
      }
  
      // If no item has 'test' set to true, remove the claim from grp
      if (!hasTrue) {
        grp.splice(i, 1);
        i--; // Decrement i because we just removed an item from the array
      }
    }
  
    // Add values to the modelGroup and return m and grp
    for (let i = 0; i < grp.length; i++) {
      let items = grp[i]['items'];
      for (let j = 0; j < items.length; j++) {
        let item = items[j];
        if (item['test'] == 'true') {
          m.push(item['value']);
        }
      }
    }
  
  
  
    return [m, grp,groups];
  }
  
 


}
