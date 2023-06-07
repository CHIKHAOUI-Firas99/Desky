import { Component, Renderer2, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { MapConceptorService } from './map-conceptor.service';
import { MapService } from '../map/map.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'app/core/auth/auth.service';
import { RoleService } from 'app/core/role/role.service';
import { MatDialog } from '@angular/material/dialog';
import { ClaimsService } from 'app/core/claimsManagement/claims.service';
import { TagsUpdateComponent } from '../tags-update/tags-update.component';
import { toInteger } from 'lodash';
import { MaterialService } from '../materials/material.service';
import { ActivatedRoute, RouteReuseStrategy, Router } from '@angular/router';

@Component({
  selector: 'app-map-conceptor',
  templateUrl: './map-conceptor.component.html',
  styleUrls: ['./map-conceptor.component.scss']
})
export class MapConceptorComponent {
  title = 'mapComponent';

  @ViewChild('canvas', { static: true }) canvas: MapComponent;
  map:MapComponent
  clicked: boolean=false;
  file:File
  optionSelected:string
  canAdd: boolean;
  canDelete: boolean;
  canEdit: boolean;
  tags: any;
  mytags: any=[];
  i: any;
  allTags: any;
  workspaceTags: any;
  nwTags: boolean=false;
  ObjectInfo: any;
  allMaterials: any;
  errMessage: any;
 public objects: any=[];
  nObjectsTab: any;
  tab: any;
  m: any;
  new_created_objects_ids: any=[];
  constructor(private _mapConceptorService : MapService,
    private materialService:MaterialService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private _authService: AuthService,
    private _roleService: RoleService,
    private _RoleService: RoleService,
    private dialog: MatDialog,
    private _claimsService: ClaimsService,
    private _router: Router,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy,
    ) { }




    updatedTag:any
    wtags:any
    open() {    
   console.log(this.mytags);
   console.log(this.canvas.workSpaceTags);

   console.log(localStorage.getItem('workspacetagsArr'));
   let  wTags= JSON.parse(localStorage.getItem('workspacetagsArr') ) 
   if (wTags) {
    
    if (Array.isArray(wTags)) {
      console.log('is arrrrrray');
      this.wtags=wTags
    }
    else {
      console.log('is an object ------->'+wTags);
      this.wtags=this.getYourTags(wTags)
    }
    
   }
    let t= this.dialog.open(TagsUpdateComponent, {
       data: { workspacetags:wTags?this.wtags:this.canvas.workSpaceTags,objectTag:this.mytags}
     })

     t.afterClosed().subscribe(result => {
       if (result) {
         console.log('The dialog was closed' );
         this.mytags=result[1]
         console.log(this.mytags);
         this.updatedTag=result[1]
         console.log(this.tags);
         localStorage.removeItem('ckeckedids')
       }
      
       
     });
   }
  async getObjectInfo(){
  console.log(this.tab);
  
  let l = this.canvas.objectsInCanvas.size    
  console.log(this.canvas.objectsInCanvas);
  console.log(this.objects);
  
  this.canvas.objectsInCanvas.forEach((value, key) => {
    console.log("value -->" +value);
          
    this.objects[(l-1).toString()] = value;
    l--
  });
  console.log(this.objects);
  
  console.log(this.canvas.getTypeofselectedObject());
  
  let id=this.canvas.getId()
console.log(this.objects);
var listnames=[]
let _object=[]
  let names:any
   let objectsmat=this.canvas.objectsMat
   if (objectsmat) {
    names= objectsmat.find((n)=>{
      return  n.id==id
     })

    

      this.objects.forEach(element => {
        if (element.id==id) {
console.log(element);
_object=element
      
          if(element.material){
            console.log(element.material);
     
            
            for (let i = 0; i < element.material.length; i++) {
              const e = element.material[i];
              console.log(e);
              if (e.name) {
                listnames.push(e.name)
              }
              else{
                listnames.push(e)
              }
              
              console.log(listnames);
              
             }
          }
  
        }
      });
     
   }


    

     let tags=[]
    console.log(this.allMaterials);
    console.log(this.objects);
    console.log(listnames);
    
    this.objects.forEach(element => {
      if (element.id==id) {
  tags=element.tags?element.tags:[]
  if (element.material) {
    element.material.forEach(e => {
      listnames.push(e.name)
    });
    
  }
      }
    });
    let workspaceName=this.canvas.workspaceName
    const data = await this.materialService.getAllMaterials().toPromise();
    const deskDetails=await this._mapConceptorService.getDeskMatTags(id).toPromise();
    let matNames=deskDetails['material']
    let desktags=deskDetails['tags']
    this.m=[]
this.m=data
    this.m.forEach((element) => {
      element.picture = this.getPictureUrl(element.picture);
    });
    let action="create"
    let new_id=0
    if (id<0) {
      this.new_created_objects_ids.forEach(element => {
        console.log(element['last_id']);
        console.log(id);
        
        
        if (element['last_id']==id) {
          action="update"
          new_id=element['new_id']
        }
      });
    }
    else{
      action="update"
    }

    console.log(action);
    
      this.dialog.open(TagsUpdateComponent, {

        data: { 
          new_id,
          action,
          canAddmat:this.optionSelected,
          workspacesNames:this.workspacesNames,
          workspaceName,
          _object,
          objectId:id,
          type:this.canvas.currentType ,
          allMat:this.m,
          CurrentMaterials:matNames,
          ObjectTags:desktags
        }
      }).afterClosed().subscribe(result => {
  
        
       if (result) {
        console.log(result);
   
// this.loadCanvas(this.canvas.workspaceName)
        this.toastr.success('desk updated')

          // this.objects.forEach(element => {
          //   if (element.id==id) {
          //     element['id']=result['id'].toString()
          //     element['tags']=result['tags']
          //     element['material']=result['material']
              
          //   }
          // });
          // this.tab=this.objects
          // console.log(this.canvas.objectsInCanvas);
          this.canvas.initialObjects.push()
          console.log('aaaaaaaaa',id,this.canvas.objectsInCanvas.get(id.toString()));
          const isDuplicate = this.new_created_objects_ids.some(obj => obj.last_id === id);

          if (id < 0 && !isDuplicate) {
            this.new_created_objects_ids.push({ last_id: id, new_id: result['id'].toString() });
          }
          
          console.log(this.canvas.objectsInCanvas);

          console.log(this.objects);
// this.loadCanvas(this.canvas.workspaceName)

       }

      });

}

updateElementID(objectsInCanvas, currentID, newID) {
  // Get the element from the set using its current ID
  const element = objectsInCanvas.get(currentID);

  // Check if the element exists
  if (element) {
    // Modify the ID value of the element
    element.id = newID;

    // Delete the element from the set
    objectsInCanvas.delete(currentID);

    // Add the element back to the set with the updated ID
    objectsInCanvas.set(newID, element);
  }
}

refreshRoute() {
  this.route.data.subscribe(() => {
    const currentUrl = this._router.url;
    this.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
    });
  });
}

  loadCanvas(name)
  {

    this.canvas.loadCanvas(name);
    this.canvas.isSelected=true
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
    workspaces : any[]
    workspacesNames :any
    ngOnInit(): void {
      localStorage.removeItem('ckeckedids')
      localStorage.removeItem('workspacetagsArr')
      console.log(
        localStorage.getItem('workspacetagsArr')
      );
      

   
      
      this.workspaces = JSON.parse(localStorage.getItem('workspace')) 
      this.getWorkspacesNames()
      setTimeout(() => {
        console.log(this.canvas);
      }, 1);
      this._authService.dispalyAdminDashboard().subscribe((data) => {
        let obj = this._claimsService.manageObject(data["details"], "workspaces");
        this.canAdd = obj["create"];
        this.canEdit = obj["update"];
        this.canDelete = obj["delete"];
        console.log(this.canDelete);
        if (!this.canAdd && !this.canEdit) {
          this.canvas.size={
            width: 1500,
            height: 900
          };
          
        }
      });
   this.materialService.getAllMaterials().subscribe((data)=>{
   this.allMaterials=data 

   
   this.allMaterials.forEach(element => {
    element.picture=this.getPictureUrl(element.picture)
  });
  console.log(this.allMaterials);
   })
    }
    getPictureUrl(picture) {
      let base64Picture;
      
      try {
        // Try to decode the base64-encoded picture
        base64Picture = atob(picture);
        
      } catch (e) {
        console.error("Invalid base64 string:", picture);
        return "";
      }
      
      // Construct the data URL for the picture
      const dataUrl = `data:image/jpeg;base64,${base64Picture}`;
    
      return dataUrl;
    }
    getWorkspacesNames(){
      return this._mapConceptorService.getWorkspacesNames().subscribe((data) =>{
        this.workspacesNames = data     
      })
    }
  getWorkspaces() {
    this.workspaces = JSON.parse(localStorage.getItem('workspace')) 
  
    
  }
 
  
  
    //CHANGE CANVAS SIZE (WIDTH AND HEIGHT)
    public changeSize() {    
      this.canvas.changeSize();
    }
  
    public getImgPolaroid(event,objectType) {
      console.log(event);
      
      this.canvas.getImgPolaroid(event,objectType);
    }
  //UPLOAD IMAGE INTO CANVAS
    public addImageOnCanvas(url) {    
      this.canvas.addImageOnCanvas(url);
      this.clicked=true
      this.nwTags=true
    }
  
    public readUrl(event) {
      
      this.canvas.readUrl(event);
      this.file = event.target.files[0];

    }
  
    public removeWhite(url) {
      this.canvas.removeWhite(url);
      this.clicked=false
      this.canvas.url=null
      this.file=null
      this.nwTags=false
    }
  
    public removeSelected( ) {
    this.objects=  this.canvas.removeSelected(this.objects);
    }
  public isSelected(){
    if (this.canvas) {
    return this.canvas.isSelected
      
    }
    return false
  }
    public clone() {
      this.canvas.clone();
    }
  
    public cleanSelect() {
      this.canvas.cleanSelect();
    }
  
    public setCanvasImage() {
      this.canvas.setCanvasImage();
    }
  
    public setId() {
      this.canvas.setId();
    }
    public rasterizeJSON() {
      this.canvas.rasterizeJSON();
    }
  
  
    public submit(){
      let l = this.canvas.objectsInCanvas.size    
      this.canvas.objectsInCanvas.forEach((value, key) => {
        console.log("value -->" +value);
              
        this.objects[(l-1).toString()] = value;
        l--
      });
      console.log(this.objects);
      
      // this.objects.forEach(element => {
      //   if (element.tags) {
      //     element.tags=this.getYourTags(element.tags)
          
      //   }
      // });
      // console.log(this.objects);
      
      this.canvas.submit(this.updatedTag?this.updatedTag:this.canvas.workSpaceTags,this.objects);
    }
    showToast(message:string,title:string): void {
      this.toastr.success(message, title);
     }
    public addWorkSpace()
    { this.canvas.ToUpdate=false
      this.canvas.addWorkSpace()
    }
    choseFile()
    {
      const elementToClick = document.getElementById('myFile');
      console.log(elementToClick);
 if (elementToClick)
{
  this.renderer.selectRootElement(elementToClick).click();
}
    }
    public deleteWorkspace()
    {
this.canvas.deleteWorkspace()
    }
  
  }