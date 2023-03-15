import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  constructor() { }

  manageObject(data,object){
    let obj = data.find((n) => n.object == object);
    let canEdit=false;
    let canAdd=false;
    let canDelete=false;

      if (obj['rights'].includes('u')) {
        canEdit = true;
      }
      if (obj['rights'].includes('d')) {
        canDelete = true;
      }
      if (obj['rights'].includes('c')) {
        canAdd = true;
      }

    return {"create":canAdd,"update":canEdit,"delete":canDelete}
  };
  
  }


