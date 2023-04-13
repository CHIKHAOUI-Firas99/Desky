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

@Component({
  selector: 'app-map-conceptor',
  templateUrl: './map-conceptor.component.html',
  styleUrls: ['./map-conceptor.component.scss']
})
export class MapConceptorComponent {
  title = 'mapComponent';

  @ViewChild('canvas', { static: false }) canvas: MapComponent;
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
  constructor(private _mapConceptorService : MapService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private _authService: AuthService,
    private _roleService: RoleService,
    private _RoleService: RoleService,
    private dialog: MatDialog,
    private _claimsService: ClaimsService,
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
      
      localStorage.removeItem('aaaa')
   
      
      this.workspaces = JSON.parse(localStorage.getItem('workspace')) 
      this.getWorkspacesNames()
      setTimeout(() => {
        console.log(this.canvas);
      }, 1);
      this._authService.dispalyAdminDashboard().subscribe((data) => {
        let obj = this._claimsService.manageObject(data["details"], "adminmap");
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
      // let rowTags =this.transformArray(val.tags) : [];
      // console.log(rowTags);
      
      // this.tags.push(rowTags)
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
  
    public getImgPolaroid(event) {
      this.canvas.getImgPolaroid(event);
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
  
    public removeSelected() {
      this.canvas.removeSelected();
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
      console.log(this.updatedTag);
      
      this.canvas.submit(this.updatedTag?this.updatedTag:this.canvas.workSpaceTags);
    }
    showToast(message:string,title:string): void {
      this.toastr.success(message, title);
     }
    public addWorkSpace() {
      this.canvas.ToUpdate=false
      this.canvas.addWorkSpace()
    }
    choseFile()
    {
      const elementToClick = document.getElementById('myFile');
console.log(elementToClick);

if (elementToClick) {
  this.renderer.selectRootElement(elementToClick).click();
}
    }
    public deleteWorkspace()
    {
this.canvas.deleteWorkspace()
    }
  
  }