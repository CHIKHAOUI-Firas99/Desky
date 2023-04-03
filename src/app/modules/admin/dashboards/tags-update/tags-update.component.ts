import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { log } from 'fabric/fabric-impl';

@Component({
  selector: 'app-tags-update',
  templateUrl: './tags-update.component.html',
  styleUrls: ['./tags-update.component.scss']
})
export class TagsUpdateComponent {
  form: any;
  t: any;
  rntags: Array<String>;
  keys: any[];
  tagMessage: boolean;
  constructor(private _fb:FormBuilder, public dialogRef: MatDialogRef<TagsUpdateComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {}
 alltags:any=[]
  transformObject(inputObject) {
  const outputObject = {
    key: inputObject.key,
    value: inputObject.value,
    id:inputObject.id
  };
  return outputObject;
}

 objectToArray(obj: any): { key: string, value: string }[] {
  return Object.keys(obj).map(key => ({
    key:key,
    value:obj.value,
    id:'value-'+key 
  }));
}
  
addTag(): void {
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
  lastTagIndex = extraTags.length - 1;
  this.disabled[lastTagIndex]=true
  this.keys=this.getExistingKeysFromExtraTags(this.form);
}



removeTag(index: number): void {
  const extraTags = this.form.get('extraTags') as FormArray;
  const lastTagIndex = extraTags.length - 1;

  // Check for empty key or value in each control and set corresponding disabled element to true
  for (let i = 0; i <= lastTagIndex; i++) {
    const control = extraTags.at(i) as FormGroup;
    if (control.get('key').value.length === 0 || control.get('value').value.length === 0) {
      this.disabled[i] = true;
    }
  }
  let control=extraTags.at(index)
  if (this.keys.includes(control.get('key').value)) {
    this.tagMessage=false
  }
  // Remove tag from tags FormArray
  this.tags.removeAt(index);

  // Remove corresponding element from disabled array
  this.disabled.splice(index, 1);
  
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
  if (this.keys.includes(valueControl.key)) {
    
    this.tagMessage=true
  }
  else{
    this.tagMessage=false
    console.log(this.tagMessage);
    
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
  this.alltags = this.data.alltags;
  
  // this.alltags = Object.entries(this.alltags).map(([key, value]) => ({ key, value,id:'value-'+key }));
  // console.log(this.alltags);
  console.log(this.alltags);
  
  // this.alltags = this.objectToArray(this.alltags);
  console.log(this.alltags);
  const storedArray = JSON.parse(localStorage.getItem('tagsArr'));
  if (storedArray) {
   this.alltags= this.mergeArrays(storedArray,this.alltags)
  }
  console.log(this.alltags);
  console.log(this.data.selectedOptions);

  let checkedIds = localStorage.getItem('ckeckedids');
  this.rntags = checkedIds ? checkedIds.split(',') : []; // Set to empty array if no checked IDs

  console.log(this.rntags);

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
  let tabtags=this.form.value['extraTags']
  console.log(tabtags);
  
  let t = this.form.value['extraTags'].map((val) => {
    return {key: val.key, value: val.value, id: 'value-' + val.key};
  });
  
  let tagsarray=t
  console.log(t);
  
  let tabids =this.getAllIds(tagsarray)
  localStorage.setItem('ckeckedids',tabids.toString())
  localStorage.setItem('tagsArr',JSON.stringify(tagsarray))
  this.dialogRef.close(  [tabids,tagsarray]);
  console.log(tabids);
  
}
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
