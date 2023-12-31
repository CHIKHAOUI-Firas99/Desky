import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { log } from 'fabric/fabric-impl';
import { MaterialService } from '../materials/material.service';
import { ToastrService } from 'ngx-toastr';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-tags-update',
  templateUrl: './tags-update.component.html',
  styleUrls: ['./tags-update.component.scss']
})
export class TagsUpdateComponent {
  form: any;
  t: any;
  rntags: Array<String>;
  keys: any[]=[];
  tagMessage: boolean;
  initaialedKeys: any;
  send: boolean;
  notags: boolean=false;
  objectsList:Array<any>=[]
  allMaterials: any;
  materials: any;
  errMessage: any;
  allMat2: any;
  objectType: any;
  _myObject: any;
  workspaceExist: boolean;
  constructor(private _fb:FormBuilder, 
    public dialogRef: MatDialogRef<TagsUpdateComponent>,
    public matdialog:MatDialog,
    private toastr:ToastrService,
    private _matService:MaterialService,
    private _MapService:MapService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
 alltags:any=[]
  transformObject(inputObject) {
  const outputObject = {
    key: inputObject.key,
    value: inputObject.value,
    id:inputObject.id
  };
  return outputObject;
}
isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch (e) {
    return false;
  }
}
 objectToArray(obj: any): { key: string, value: string }[] {
  return Object.keys(obj).map(key => ({
    key:key,
    value:obj.value,
    id:'value-'+key 
  }));
}
  
addTag(): void {
  this.notags=false
  const extraTags = this.form.get('extraTags') as FormArray;
  var lastTagIndex = extraTags.length - 1;

  // check if all previous rows have both key and value fields filled
  for (let i = 0; i <= lastTagIndex; i++) {
    const control = extraTags.at(i) as FormGroup;
    if (control.get('key').value.length === 0 || control.get('value').value.length === 0) {
      return; // don't allow addition of new row if any previous row has empty fields
    }
  }

  // if all previous rows are filled, allow addition of new row
  const tagFormGroup = this._fb.group({
    key: new FormControl(''),
    value: new FormControl('')
  });

  this.tags.push(tagFormGroup);
  this.disabled=this.disabled.map(()=>true)
    lastTagIndex = extraTags.length - 1;
  this.disabled=this.disabled.map(()=>true)
  this.disabled[lastTagIndex]=true

  this.keys=this.getExistingKeysFromExtraTags(this.form);
}



removeTag(index: number): void {
  
  
  const extraTags = this.form.get('extraTags') as FormArray;
  var lastTagIndex = extraTags.length - 1;

  // Check for empty key or value in each control and set corresponding disabled element to true
  for (let i = 0; i <= lastTagIndex; i++) {
    const control = extraTags.at(i) as FormGroup;
    if (control.get('key').value.length === 0 || control.get('value').value.length === 0) {
      this.disabled[i] = true;
    }
  }
  let control=extraTags.at(index)
  console.log(control.get('key').value);
  
  if (control.get('key').value && this.keys) {
    if (this.keys.includes(control.get('key').value)) {
      this.tagMessage=false
    }
  }

  // Remove tag from tags FormArray
  this.tags.removeAt(index);

  // Remove corresponding element from disabled array
  this.disabled.splice(index, 1);
  lastTagIndex = extraTags.length - 1;
  console.log(lastTagIndex);
  
  console.log(extraTags.get(lastTagIndex.toString()).value);
let lastTag=extraTags.get(lastTagIndex.toString()).value
  let check=lastTag.key && lastTag.value
  
  if (check) {
    this.disabled[lastTagIndex]=false
  } 
}
cancel():boolean{

  return  this.form.get('extraTags').length>1
}
checkFormControlChanges(event: KeyboardEvent, index: number) {
  const target = event.target as HTMLInputElement;
  
  const keyControl = this.form.get('extraTags').value[index];
  if (keyControl.key === target.name && keyControl.value !== target.value) {
    // Set changesMade to false when a change is detected
  }
  
  const valueControl = this.form.get('extraTags').value[index];
  if (valueControl.value === target.name && valueControl.key !== target.value) {
    // Set changesMade to false when a change is detected
  }
  
  const formValues = this.form.value.extraTags;
  const emptyValues = formValues.filter((control: any) => !control.key || !control.value);
  console.log(formValues);
  
  if (emptyValues.length === 0) {
    console.log(emptyValues);
    
    this.disabled[index] = false;
    console.log(this.disabled);
    
    // Set changesMade to true if all values are not empty or null
  } else {
  
    this.disabled[index] = true;
  }
  if (target.name === 'key') {
    let count = 0;
    let check=false
    console.log(this.getExistingKeysFromExtraTags(this.form));
    console.log(this.keys);
    
    // for (let i = 0; i < this.keys.length; i++) {
    //   if (this.keys[i] === valueControl.key) {
    //     count++;
    //     check=   this.initaialedKeys.includes(this.keys[i]) &&
    //     this.getExistingKeysFromExtraTags(this.form).includes(this.keys[i]) 
    //   }
    // }
    let tabkeys=this.getExistingKeysFromExtraTags(this.form)
    let nb=0
    for (let i = 0; i < tabkeys.length; i++) {
    if (tabkeys[i].toLocaleLowerCase() === valueControl.key.toLocaleLowerCase()) {

        nb++;
      }
    }
    

    console.log(tabkeys);
    console.log(check);
    
    if (  nb>1) {
      this.tagMessage = true;
    } else {
      this.tagMessage = false;
      console.log(this.tagMessage);
    }
  }
  
  if (valueControl.key && !valueControl.value) {
    this.send=true
  } else {
    this.send=false
  }
}
disabled: boolean[] = [];
removedisabled=true
transformArray(arr: { key: string; value: string[] }[]): any {
  return arr.map((elem) => ({
    key: elem.key,
    value: {
      data: elem.value.map((val, index) => ({
        id: `element-${elem.key}-${index}`,
        value: val
      })),
      id: `value-${elem.key}`
    }
  }));
}
mergeArrays(arr1, arr2) {
  return arr1.map((obj1) => {
    const matchingObj2 = arr2.find((obj2) => obj2.key === obj1.key);
    if (matchingObj2) {
      return { key: obj1.key, value: matchingObj2.value };
    } else {
      return obj1;
    }
  }).concat(arr2.filter((obj2) => !arr1.find((obj1) => obj1.key === obj2.key)));
}
closeDialog(){
  this.dialogRef.close()
}
ngOnInit() {
  console.log(this.data);

  if (this.data.alltags) {
    console.log(this.data);
    localStorage.removeItem('workspacetagsArr')
    this.alltags = this.data.alltags;
    this.notags=this.alltags.length == 0
  }

  
  else if (this.data.workspacetags){

    this.alltags = this.data.workspacetags;
    console.log(this.alltags);
    
    console.log(this.alltags);
    
    this.notags=this.alltags.length == 0
  }
  else if( this.data.allMat){
    console.log(this.data.workspaceName);
    
    this.workspaceExist= this.data.workspacesNames.includes(this.data.workspaceName)
this.alltags=this.data.ObjectTags?this.data.ObjectTags:[]
this.notags=this.alltags.length == 0
this.data.allMat.forEach(element => {
  if (this.isBase64(element.picture)) {
    element.picture=this.getPictureUrl(element.picture)
  }
  
});
this.allMaterials=this.data.allMat

this.allMat2=this.data.allMat
this.objectType = this.data.type
console.log(this.allMaterials);
this.materials=this.data.CurrentMaterials 

}
  
  
  // this.alltags = Object.entries(this.alltags).map(([key, value]) => ({ key, value,id:'value-'+key }));
  // console.log(this.alltags);
  console.log(this.notags);
  
  // this.alltags = this.objectToArray(this.alltags);
  console.log(this.alltags);

  const   storedArray = JSON.parse(localStorage.getItem('tagsArr'));
  
   
 
  // storedArray = JSON.parse(localStorage.getItem('workspacetagsArr'));
 
  // if (storedArray) {
  //  this.alltags= this.mergeArrays(storedArray,this.alltags)
  // }
  console.log(this.alltags);
  console.log(this.data.selectedOptions);

  let checkedIds = localStorage.getItem('ckeckedids');
  this.rntags = checkedIds ? checkedIds.split(',') : []; // Set to empty array if no checked IDs

  console.log(this.rntags) ;

  this.form = this._fb.group({
    tags: new FormControl(this.rntags.length ? this.rntags : this.data.selectedOptions),
    extraTags: this._fb.array(this.alltags.map((tag) => {
      return this._fb.group({
        key: [tag.key],
        value: [tag.value]
      });
    }))
  });

  for (let i = 0; i < this.tags.length; i++) {
    this.disabled.push(true);
  }
this.disabled[this.tags.length-1]=false
  console.log(this.form.get('extraTags'));
 this.initaialedKeys= this.alltags.map((tag) => tag.key)
  console.log(this.initaialedKeys);
  if (this.notags) {
    this.addTag()
  }
  
}

getExistingKeysFromExtraTags(formGroup) {
  const extraTagsArray = formGroup.get('extraTags') as FormArray; // get the 'extraTags' FormArray from the formGroup
  const keysArray = extraTagsArray.controls.map(control => control.get('key').value); // extract the 'key' value from each FormGroup control and create a new array
  return keysArray.filter(key => key); // filter out any falsy values (e.g. undefined, null, '') and return the resulting array
}

  
  objectOfTags(tab: Array<string>): { key: string, value: any[] }[] {
    const result = [];
  console.log(this.alltags);
  
    this.alltags.forEach(tag => {
      const tagValues = tag.value.data.filter(elm => tab.includes(elm.id)).map(elm => elm.value);
  
      if (tagValues.length > 0) {
        const existingTag = result.find(obj => obj.key === tag.key);
  
        if (existingTag) {
          existingTag.value.push(...tagValues);
        } else {
          result.push({ key: tag.key, value: tagValues });
        }
      }
    });
  
    return result;
  }


submit(){
  console.log('>>>>>>>><');
  
  let tabtags=this.form.value['extraTags']
  console.log(tabtags);
  
  let t = this.form.value['extraTags'].map((val) => {
    return {key: val.key, value: val.value, id: 'value-' + val.key};
  });
  
  let tagsarray=t
  console.log(t);
  
  let tabids =this.getAllIds(tagsarray)
  console.log(tagsarray);
  if (this.data.alltags) {
    console.log('b');
    
    localStorage.setItem('ckeckedids',tabids.toString())
    localStorage.setItem('tagsArr',JSON.stringify(tagsarray))
    console.log(localStorage.getItem('tagsArr'));
    
    this.dialogRef.close(  [tabids,tagsarray]);
  }
  else if(this.data.workspacetags){
    console.log('a');
    
    localStorage.setItem('workspacetagsArr',JSON.stringify(tagsarray))
    this.dialogRef.close(  [tabids,tagsarray]);
    console.log(localStorage.getItem('workspacetagsArr'));
  }
  else if(this.data.allMat){
    let obj={}
    console.log(this.allMat2);
    
console.log(this.allMaterials);
console.log(this.materials);
let listmat=[]
    let materials=this.allMaterials
    .filter((n)=>{
      // delete n['picture'];
      // listmat.push
     return  this.materials.includes(n.name)
    }
      )
console.log(materials);

    materials.forEach(element => {
      listmat.push(element['name'])
  // element.picture=element.picture.split(',')[1];
});
    if (materials.length > 0) {
      obj['material']=listmat
    }
 
  obj['tags']=tagsarray
  console.log(obj);
  console.log(obj);
  this._myObject=this.data._object
this._myObject['material']=obj['material']
this._myObject['tags']=     this.getYourTags(obj['tags'])
    let id=this.data.objectId
if(!this.data.workspaceName){
  this.data.workspaceName=""
}
console.log(this._myObject,);
let action=""
if (id > 0) {
  action="update"
  
}
if (id <=0) {
  action="create"
}
if (this.data.new_id!=0) {
this._myObject['id']=this.data.new_id
  
}
console.log(this._myObject);

this._MapService.updatedeskDetails(this._myObject,this.data.workspaceName,this.data.action).subscribe((data)=>{
  console.log(data);
  console.log(this._myObject);
  
  if (Number(this._myObject['id'])<=0) {
    console.log("nik omk");
    
    obj['id']=data
  }
 else {obj['id']=this._myObject['id']}
  console.log(obj);
  
  this.dialogRef.close(obj)
},(err)=>{
  this.errMessage=err["error"]["detail"]
  if (!this.errMessage) {
     this.errMessage='Data too long ! please try other image'
  }
  this.toastr.error(this.errMessage, 'Failed');
  this.dialogRef.close()
})

    
  }

  
}
getYourTags(arr) {
  const transformedArr = [];
  for (let obj of arr) {
    console.log(obj);
    
    if (obj.key.length > 0 && obj.value.length > 0)
    {
      transformedArr.push({ key: obj.key, value: obj.value });
    }
  }
  return transformedArr;
}
getPictureUrl(picture) {
  let base64Picture;
  
  try {
    // Try to decode the base64-encoded picture
    base64Picture = atob(picture);
    
  } catch (e) {
    console.error("Invalid base64 string:", picture);
    return "";
  }}
getAllIds(arr) {
  const ids = [];
  arr.forEach((obj) => {
    ids.push(obj.id)
  });
  return ids;
}
  onNoClick(): void {
    this.dialogRef.close();
  }
  get tags(): FormArray {
    return this.form.get('extraTags') as FormArray;
  }
}
