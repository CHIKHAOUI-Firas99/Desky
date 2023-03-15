import { JsonPipe } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fabric } from 'fabric';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {

  @ViewChild('htmlCanvas') htmlCanvas: ElementRef;
  private workSpaces : any[]=[]
  private mapUrl : String
  private u :any
  private objectsInCanvas = new Map<string,any>()
  private canvas: fabric.Canvas | undefined;
  private idCounter : number =0
  private latestValidPosition :any;
  private isIntersect : Boolean = false

  public props = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
  };
  public textString: string | undefined;
  public url: string | ArrayBuffer = '';
  public size: any = {
    width: 1000,
    height: 1000
  };
  public workspaceName : String = ""
  public json: any;
  public selected: any;

  constructor(private _httpClient: HttpClient) { }
  loadCanvas(name) {
    this.workspaceName = name
    this.canvas.clear()
    this.objectsInCanvas.clear()
    let listWorkspaces = localStorage.getItem('workspace');
    let l = JSON.parse(listWorkspaces)
    let i =10000
    let path=''
    l.forEach(w => {
      if(w.name == name){
        console.log(w);
        
        path = w.mapUrl
        w.objects.forEach(el => {
          if(el){
            i--
            this.objectsInCanvas.set(i.toString(),{x: el.x,y:el.y,o:el.o,path:el.path,scaleX : el.scaleX,scaleY:el.scaleX,flipX:el.flipX,flipY:el.flipY})
          }      
        });
      }    
    });
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
          flipY : obj.flipY
        });
        this.extend(image,key);
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }    
    //load background 
    if (path) {            
      fabric.Image.fromURL(path, (image) => {
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
       this.mapUrl = path
        this.selectItemAfterAdded(image);
      });
    }
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
        this.onChange(e)
      },
      'object:modified': (data) => {
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
        const selectedObject = e.target;                
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';
      },
      'object:selected':(e) => {                   
      },

      'selection:cleared': (e) => {        
        this.selected = null;
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
        this.latestValidPosition ={x : e.target['translateX'],y: e.target['translateY'],o:e.target['angle'],scaleX : e.target['scaleX'],scaleY : e.target['scaleY']}
      }    
    });
    this.canvas.on('mouse:up',(e) => {
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
      this.changeParam()
      }      
    })
  }
  onChange(options) {
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
        strokeWidth : 5
        //NOT SCALABLE
      });
      this.idCounter++
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
      this.objectsInCanvas.set(this.idCounter.toString(),{path,x,y,o,scaleX,scaleY,flipX,flipY})
      this.selectItemAfterAdded(image);
    });
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
        this.selectItemAfterAdded(image);
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
    this.url = '';
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
    const activeObject = this.canvas.getActiveObject();
    let id = this.canvas.getActiveObject().toObject().id.toString();
    let path = this.objectsInCanvas.get(id).path;  
    if (activeObject) {
      fabric.loadSVGFromURL(path, (objects, options) => {
        const image = fabric.util.groupSVGElements(objects, options);
        image.set({
          left: 10,
          top: 10,
          angle : 0,
          padding: 0,
          cornerSize: 10,
          hasRotatingPoint: true,
          borderColor : "green",
          borderScaleFactor : 5,
          strokeWidth : 10
        });
        let scaleX = this.objectsInCanvas.get(id).scaleX
        let scaleY = this.objectsInCanvas.get(id).scaleY
        let o = 0
        image.scaleX = scaleX
        image.scaleY = scaleY
        this.idCounter++
        this.extend(image, this.idCounter);
        this.canvas.add(image);
        let x = 10
        let y = 10
        let flipX = false
        let flipY = false
        this.objectsInCanvas.set(this.idCounter.toString(),{path,x,y,o,scaleX,scaleY,flipX,flipY})
        this.selectItemAfterAdded(image);
      });
    }
  }
//SET OBJECT POSITION AND SCALE
  changeParam(){
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
      this.objectsInCanvas.set(id,{path,x,y,o,scaleX,scaleY,flipX,flipY})
    
    }
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
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();
    if (activeObject) {
      this.objectsInCanvas.delete(activeObject.toObject().id.toString())
      this.canvas.remove(activeObject);
      // this.textString = '';
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      const self = this;
      activeGroup.forEach((object) => {
        self.canvas.remove(object);
      });
    }
  }
  confirmClear() {
    if (confirm('Are you sure?')) {
      this.canvas.clear();
    }
  }
  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }
  submit(){
    let objects =[]
    this.objectsInCanvas.forEach((value, key) => {
      console.log(key);
      
      objects[(Number(key)-1).toString()] = value;
    });
    console.log(this.canvas);
    if (this.workspaceName != null){
      console.log(this.objectsInCanvas);
      this.workSpaces.push({"name" :this.workspaceName ,"mapUrl":this.mapUrl,objects})      
      localStorage.setItem('workspace',JSON.stringify(this.workSpaces))
      this.pushWorkspace(this.workSpaces).subscribe((data) =>{
        console.log(data);
      })
    }
    this.objectsInCanvas.clear()

  }
  pushWorkspace(w:any):Observable<any>{     
   return this._httpClient.post<any>('http://localhost:5000/map',w)
}

  addWorkSpace(){    
    this.objectsInCanvas.clear()
    this.canvas.clear()
    this.workspaceName = ""
  }
}
