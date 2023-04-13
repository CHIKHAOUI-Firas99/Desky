import { JsonPipe } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fabric } from 'fabric';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MapService } from './map.service';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {

  @ViewChild('htmlCanvas') htmlCanvas: ElementRef;
  private workSpace : any
  private mapUrl : String
  private u :any
  private objectsInCanvas = new Map<string,any>()
  private canvas: fabric.Canvas | undefined;
  private idCounter : number =0
  private latestValidPosition :any;
  private isIntersect : Boolean = false
  public readonly : Boolean = false
  public workspacesNames :any
  public props = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
  };
  public textString: string | undefined;
  public url: string | ArrayBuffer = '';
  public size: any = {
    width: 1100,
    height: 900
  };
  public workspaceName : String = ""
  public json: any;
  public selected: any;
public isSelected:boolean=false
  public workSpaceTags: Array<any>=[];
  ToUpdate: boolean=false;
  workspaceId: any;
  errMessage: any;
  constructor(
    private dialog: MatDialog,

    private toastr: ToastrService,
    private _mapService : MapService ,
    private router: Router,
    private route: ActivatedRoute,
    routeReuseStrategy : RouteReuseStrategy) { }
    refreshRoute() {
      this.route.data.subscribe(() => {
        const currentUrl = this.router.url;
        this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
        });
      });
    }
  loadCanvas(name) {
    this._mapService.getWorkspace(name).subscribe((workspace) =>{
    this.readonly=false
      this.ToUpdate=true
      this.workspaceName = workspace.name
      this.workSpaceTags=workspace["tags"]
      this.workspaceId=workspace["id"]
      if (!this.workSpaceTags) {
        this.workSpaceTags=[]
      }
      console.log(this.workSpaceTags);
      this.canvas.clear()
      this.objectsInCanvas.clear()
      this.addImageOnCanvas(workspace.mapUrl)
      workspace.objects.forEach(obj =>{        
        this.objectsInCanvas.set(obj.id.toString(),{
          id:obj.id.toString(),
          x: obj.x,
          y:obj.y,
          o:obj.o,
          path:obj.path,
          scaleX : obj.scaleX,
          scaleY:obj.scaleY,
          flipX:obj.flipX,
          flipY:obj.flipY,
          type : obj.discriminator
        })

      })
      for (let key of Array.from(this.objectsInCanvas.keys())){
        let obj = this.objectsInCanvas.get(key)
        fabric.loadSVGFromURL(obj.path, (objects, options) => {
          const image = fabric.util.groupSVGElements(objects, options);     
          image.set({
            left : obj.x,
            top : obj.y,
            angle: obj.o,
            padding: 0,
            cornerSize: 10,
            borderScaleFactor : 5,
            strokeWidth : 5,
            hasRotatingPoint: true,
            scaleX : obj.scaleX,
            scaleY : obj.scaleY,
            flipX : obj.flipX,
            flipY : obj.flipY,
            borderColor: "blue",
          });
          this.extend(image,key);
          this.canvas.add(image);
          this.selectItemAfterAdded(image);
        });
      }
       
      console.log(this.objectsInCanvas);
  
    })
    

  }
  ngAfterViewInit(): void {
    // let json = 
    // setup front side canvas
    this.canvas = new fabric.Canvas(this.htmlCanvas.nativeElement, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue',
      isDrawingMode: false,
    });


    this.canvas.on({
      'object:moving': (e) => {
        const objects = this.canvas.getActiveObjects()
        var obj = e.target;                
        // if object is too big ignore
       if(obj.height > this.size.height || obj.width > this.size.width){
           return;
       }        
       obj.setCoords();        
       // top-left  corner
       if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
           obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
           obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
       }
       // bot-right corner
       if(obj.getBoundingRect().top+obj.getBoundingRect().height  > this.size.height  || obj.getBoundingRect().left+obj.getBoundingRect().width  > this.size.width ){
           obj.top = Math.min(obj.top, obj.canvas.getHeight()-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
           obj.left = Math.min(obj.left, obj.canvas.getWidth()-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
       }
        if(objects.length == 1){

         this.onChange(e)

        }
        else{                    
          this.onChange(objects)

        }

      },
      'object:modified': (data) => {
        // this.isSelected=false
      },
      'selection:created':(e) => {
        const selectedObject = e.target;
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';
        if (selectedObject.type !== 'group' && selectedObject) {
          this.getId();
          // this.getOpacity();
        }
      },

      'selection:updated': (e) => {
        // this.isSelected=true
        const selectedObject = e.target;                
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';
      },
      'object:selected':(e) => {
        // this.isSelected=true

         

                       
      },

      'selection:cleared': (e) => {        
        this.selected = null;
        // this.isSelected=false
      },
      'before:transform':(e) =>{
        if (this.isIntersect){
          this.latestValidPosition ={x : e.target['translateX'],y: e.target['translateY'],o:e.transform['target']['angle']}
          console.log("can't place here");
        }        
      },
      'object:scaling':(e) =>  this.onChange(e),
      'object:rotating': (e) =>  this.onChange(e),
    });
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    // get references to the html canvas element & its context
    this.canvas.on('mouse:down', (e) => {
      if(e.target){
        // this.isSelected=true
        this.latestValidPosition ={x : e.target['translateX'],y: e.target['translateY'],o:e.target['angle'],scaleX : e.target['scaleX'],scaleY : e.target['scaleY']}
      } 
      else{
        this.selected=false
        console.log('its empty selection');
        
      }   
    });
    this.canvas.on('mouse:up',(e) => {

console.log('mouse up');

      let objects = this.canvas.getActiveObjects();
if (objects.length>0) {
  console.log('rrr');
  
  // this.isSelected=true
  
}
else{
  console.log('aaa');
  
  // this.isSelected=false
}
      if (objects.length==1){
        let obj = e.target       
        if(obj){
          if (obj.borderColor == "red"){
            let id = obj.toObject().id.toString()
            obj.scaleX = this.latestValidPosition.scaleX
            obj.scaleY = this.latestValidPosition.scaleY
            obj.angle = this.latestValidPosition.o        
            obj.setPositionByOrigin(new fabric.Point(this.latestValidPosition.x,this.latestValidPosition.y),'center','center')
            obj.setCoords()
            obj.borderColor = "green"
          }
          else{   
            let id = obj.toObject().id      
            id = id.toString()
            let x = obj['left']
            let y = obj['top']
            let o =obj['angle']
        }
        }
      }
      else if(objects.length>1){
        const json = JSON.stringify(this.canvas);
        const test = JSON.parse(json)
        console.log(test.objects[0].id+" left --->" +test.objects[0].left);
        let l =[]
        objects.forEach((obj) => {
          let id = obj.toObject().id.toString()
          l.push(id)    
          console.log(l);      
        })
        

      }                
      this.changeParam()

    })
  }
  onChange(options) {
    if(options.length>1){
      const activeSelection: fabric.ActiveSelection | undefined = this.canvas.getActiveObject() as fabric.ActiveSelection | undefined;
      if (activeSelection) {
        console.log(activeSelection);
        
        let s = 0
        this.canvas.forEachObject(function(obj) {
          for (let index = 0; index < activeSelection._objects.length; index++) {
            if (obj === activeSelection._objects[index]) return;
          }
          if(activeSelection.intersectsWithObject(obj)){
            console.log(obj);
            s++
          }
          activeSelection.set('borderColor' ,s >0 ? "red" : "green");
        });

      }

    }
    else{
      options.target.setCoords();
      let s = 0
      this.canvas.forEachObject(function(obj) {
        if (obj === options.target) return;
        if(options.target.intersectsWithObject(obj)){
          s++
        }
        options.target.set('borderColor' ,s >0 ? "red" : "green");
      });
    }

  }

  /*------------------------Block elements------------------------*/
  // Block "Size"
  changeSize() {
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
  }
  // Block "Add images"
  getImgPolaroid(event: any) {
    const el = event.target;    
    fabric.loadSVGFromURL(el.src, (objects, options) => {      
      const image = fabric.util.groupSVGElements(objects, options);
      image.set({
        left: 0,
        top: 0,
        angle: 0,
        padding: 0,
        cornerSize: 10,
        hasRotatingPoint: true,
        borderColor : "green",
        borderScaleFactor : 5,
        strokeWidth : 5,
        //NOT SCALABLE
      });
      this.idCounter--
      this.extend(image, this.idCounter);
      this.canvas.add(image);
      let x = 0
      let y = 0
      let o = 0
      let scaleX = 1
      let scaleY = 1
      let flipX = false
      let flipY = false
      let path = el.src
      let type = "desk"
      let id = this.idCounter.toString()
      this.objectsInCanvas.set(this.idCounter.toString(),{id,path,x,y,o,scaleX,scaleY,flipX,flipY,type})
      this.selectItemAfterAdded(image);
      // const zoom = this.canvas.getZoom();
      // this.canvas.setZoom(zoom * 1.1);

    });
  }
  deleteWorkspace() {
    if (this.workspaceId) 
    {
      this.dialog.open(DeleteConfirmationComponent, {
        width: "640px",
        disableClose: true,
        data: {
          workspaceId:this.workspaceId,
          message: "Are you sure want to delete?",
          buttonText: {
            ok: "Save",
            cancel: "No",
          },
        },
      });

      
    }
  }
  // Block "Upload Image"
  addImageOnCanvas(url) {
    if (url) {      
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasRotatingPoint: false,
          //NOT EVENTED IMAGE
          evented : false,
        });
        this.extend(image, this.randomId());
        this.canvas.setBackgroundImage(image, this.canvas.renderAll.bind(this.canvas), {
          scaleX: this.size.width / image.width,
          scaleY: this.size.height  / image.height
       });
       this.mapUrl = url
      });
    }
  }


//Upload image
  readUrl(event) {    
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.url = readerEvent.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
    this.mapUrl=""

  }
  /*Canvas*/

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
    
  }

  extend(obj, id) {
    obj.toObject = ((toObject) => {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          id
        });
      };
    })(obj.toObject);
    
  }
  setCanvasImage() {
    const self = this;
    if (this.props.canvasImage) {
      this.canvas.setBackgroundColor(new fabric.Pattern({ source: this.props.canvasImage, repeat: 'repeat' }), () => {
        self.props.canvasFill = '';
        self.canvas.renderAll();
      });
    }
  }
  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/
  clone() {
    const activeObjects = this.canvas.getActiveObjects();
    const clonedObjects = [];
    activeObjects.forEach(activeObject => {
        let id = activeObject.toObject().id.toString();
        let path = this.objectsInCanvas.get(id).path;  
        fabric.loadSVGFromURL(path, (objects, options) => {
            const image = fabric.util.groupSVGElements(objects, options);
            image.set({
                left: activeObject.left + 10,
                top: activeObject.top + 10,
                angle : activeObject.angle,
                padding: 0,
                cornerSize: 10,
                hasRotatingPoint: true,
                borderColor : "green",
                borderScaleFactor : 5,
                strokeWidth : 10
            });
            let scaleX = this.objectsInCanvas.get(id).scaleX;
            let scaleY = this.objectsInCanvas.get(id).scaleY;
            let o = 0;
            image.scaleX = scaleX;
            image.scaleY = scaleY;
            this.idCounter--;
            this.extend(image, this.idCounter);
            this.canvas.add(image);
            let x = activeObject.left + 10;
            let y = activeObject.top + 10;
            let type = this.objectsInCanvas.get(id).type;
            let flipX = false;
            let flipY = false;
            this.objectsInCanvas.set(this.idCounter.toString(),{id,path,x,y,o,scaleX,scaleY,flipX,flipY,type});
            clonedObjects.push(image);
        });
    });
    this.canvas.renderAll();
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    if (clonedObjects.length > 0) {
        this.canvas.setActiveObject(new fabric.ActiveSelection(clonedObjects, {
            canvas: this.canvas
        }));
    }
}

  
  

  


//SET OBJECT POSITION AND SCALE
  changeParam(){
    const objects = this.canvas.getActiveObjects()
    if (objects.length == 1){
      const activeObject = this.canvas.getActiveObject();
      if (activeObject){
        let x =activeObject['left']
        let y =activeObject['top']
        let o =activeObject['angle']
        let scaleX = activeObject['scaleX']
        let scaleY = activeObject['scaleY']
        let flipX = activeObject['flipX']
        let flipY = activeObject['flipY']
        let id = this.canvas.getActiveObject().toObject().id.toString();
        console.log("id --->",id);
        
        let path = this.objectsInCanvas.get(id).path
        let type = this.objectsInCanvas.get(id).type
        this.objectsInCanvas.set(id,{id,path,x,y,o,scaleX,scaleY,flipX,flipY,type})
      }

    }
    else if(objects.length>1){
      objects.forEach((object) => {
        let x =object['left']
        let y =object['top']
        let o =object['angle']
        let scaleX = object['scaleX']
        let scaleY = object['scaleY']
        let flipX = object['flipX']
        let flipY = object['flipY']
        let id = object.toObject().id.toString()
        console.log("ID : " + id +" left :" + x);
                
        let path = this.objectsInCanvas.get(id).path
        let type = this.objectsInCanvas.get(id).type
        this.objectsInCanvas.set(id,{id,path,x,y,o,scaleX,scaleY,flipX,flipY,type})
      })
    }
    console.log(this.objectsInCanvas);
    

  }
  getId() {
    this.props.id = this.canvas.getActiveObject().toObject().id;
  }
  setId() {
    const val = this.props.id;
    const complete = this.canvas.getActiveObject().toObject();
    console.log(complete);
    this.canvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }
  /*System*/
  removeSelected() {
    const activeObjects = this.canvas.getActiveObjects();
    this.canvas.discardActiveObject();
    if (activeObjects.length) {
      this.canvas.remove.apply(this.canvas, activeObjects);
      activeObjects.forEach((activeObject) => {
        const id = activeObject.toObject().id.toString();
        this.objectsInCanvas.delete(id);
      });
    }
  }
  
  confirmClear() {
    if (confirm('Are you sure?')) {
      this.canvas.clear();
    }
  }
  getYourTags(arr) {
    const transformedArr = [];
    for (let obj of arr) {
      if (obj.key.length > 0 && obj.value.length > 0) {
        transformedArr.push({ key: obj.key, value: obj.value });
      }
    }
    return transformedArr;
  }
  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }
  submit(tags){
    let objects =[]
    let l = this.objectsInCanvas.size    
    this.objectsInCanvas.forEach((value, key) => {
      console.log("value -->" +value);
            
      objects[(l-1).toString()] = value;
      l--
    });
    console.log(this.objectsInCanvas);
    
    if (this.workspaceName != null){
      this.workSpace = {
        "name" : this.workspaceName,
        "mapUrl" : this.mapUrl,
        objects,
        "tags":this.getYourTags(tags)
      } 
      console.log(this.workSpace);
      console.log(this.ToUpdate);
      
      if(!this.ToUpdate){
        console.log('aaa');
        
          this._mapService.addWorkspace(this.workSpace).subscribe((data) =>{
          console.log(data);
          this.showToast('workspace added','success')
          this.refreshRoute()
        },(err)=>{
          console.log(err);
          this.errMessage=err["error"]["detail"]
          
          this.toastr.error(this.errMessage, 'Failed');
          
        })
      }
      else { 
        console.log("bbbb");
        
        this._mapService.updateWorkspace(this.workspaceId,this.workSpace).subscribe((data) =>{
          console.log(data);
          this.showToast('workspace updated','success')

          this.refreshRoute()
          
        },(err)=>{
          console.log(err);
          this.errMessage=err["error"]["detail"]
          
          this.toastr.error(this.errMessage, 'Failed');
          
        })

      }

    }
  }
  showToast(message:string,title:string): void {
    this.toastr.success(message, title);
   }

  addWorkSpace(){    
    this.objectsInCanvas.clear()
    this.canvas.clear()
    this.workspaceName = ""
    this.refreshRoute() 
    this.readonly = true

  }

}