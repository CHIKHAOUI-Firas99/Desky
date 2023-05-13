import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from 'app/modules/booking/booking.service';
import { fabric } from 'fabric';
import { AddReservationComponent } from '../add-reservation/add-reservation.component';

@Component({
  selector: 'app-booking-map',
  templateUrl: './booking-map.component.html',
  styleUrls: ['./booking-map.component.scss'],


})
export class BookingMapComponent {
  @ViewChild('htmlCanvasBook') htmlCanvas: ElementRef;
  private canvas: fabric.Canvas | undefined;
  public workspaceName : String = ""
  private objectsInCanvas = new Map<string,any>();
  private mapUrl : String
  public date : String
  public sss: any = {
    width: 1400,
    height: 900
  };

  constructor(
    private _bookingService : BookingService ,
    private  dialog: MatDialog,

  ){}

  ngAfterViewInit(): void {
    // let json = 
    // setup front side canvas
    this.canvas = new fabric.Canvas(this.htmlCanvas.nativeElement, {
      hoverCursor: 'pointer',
      selection: false,
      selectionBorderColor: 'blue',
      isDrawingMode: false,
      width : this.sss.width,
      height:this.sss.height,
    });

    this.canvas.on('mouse:down',(e) => {
      console.log(e);
      
      if (e.target){
        let color = e.target["_objects"][1]["group"]["_objects"][1]["_objects"][0]["fill"] 
        let id = this.canvas.getActiveObject().toObject().id.toString();
        console.log(id);
        const dialogRef = this.dialog.open(AddReservationComponent,{
          width: '700px',disableClose: true, 
          data:
          {"id": id,
          "workspaceName" : this.workspaceName,
          "date" : this.date,
          "color" : color
            }

        });
        this.cleanSelect()      

      }
      
      
    })

  }

  loadCanvas(name,date) {
    this.date = date
    this._bookingService.getWorkspaceForBook(name,date).subscribe((workspace) =>{
      this.workspaceName = workspace.name
      this.canvas.clear()
      this.objectsInCanvas.clear()
      this.addImageOnCanvas(workspace.mapUrl)
      console.log(workspace.bookedDesks);
      
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
            selectable :true,
            lockUniScaling : true,
            hasControls :false
          });
          // this.extend(image,key);
          // this.canvas.add(image);
          const scaledRadius = 15 * obj.scaleX;          
          let totallyBooked = workspace.bookedDesks.indexOf(Number(key)) !=-1
          let partiallyBooked = workspace.availableBookedDesks.indexOf(Number(key)) !=-1
          let color = "green"
          if (totallyBooked) color = "red"
          if (partiallyBooked) color = "orange"
          console.log(color);

          if(obj.type == "desk")
          {
            var c = new fabric.Circle({
              left: image.getCenterPoint().x-scaledRadius,
              top:image.getCenterPoint().y-scaledRadius,
              radius: 15,
              fill: color,
              stroke: '#666',
              strokeWidth : 2,
              selectable: true,
              centeredScaling:true,
              padding:0,
              borderScaleFactor : 2,
              scaleX:obj.scaleX,
              scaleY:obj.scaleY,
              hasRotatingPoint: false,
              borderColor: 'black',
              cornerColor: 'black'
          });
          c.getCenterPoint()
          const text = new fabric.Text(obj.id, {
            fontFamily: 'Calibri',
            left: c.getCenterPoint().x,
            top: c.getCenterPoint().y,
            fontSize: 20*obj.scaleX,
            originX: 'center',
            originY: 'center',
          });
          var t = new fabric.Group([c,text])
          var g = new fabric.Group([image,t])
            g.hasControls = false;
            g.lockMovementX = true, // prevent horizontal movement
            g.lockMovementY = true, // prevent vertical movement
            g.selectable = true
            g.evented=true;
          this.extend(g,key)
          this.canvas.add(g)           
          }
          else{
            this.extend(image,key);
            this.canvas.add(image);
          }
          // this.selectItemAfterAdded(image);


      // var t = new fabric.Text(key, {
      //       fontFamily: 'Calibri',
      //       fontSize: 20,
      //       textAlign: 'center',
      //       originX: 'center',
      //       originY: 'center',
      //       left: image.getCenterPoint().x-(13)/2,
      //       top: image.getCenterPoint().y-(13)/2
      //   });
      
      // var g = new fabric.Group([c, t],{
      //       // any group attributes here
      //   });
      //   g.hasControls = true;
      //   g.evented=true
          // this.canvas.add(new fabric.Circle({radius: 25*obj.scaleX, left: obj.x+((image.width*obj.scaleX)/2)-(25*obj.scaleX), top: obj.y, fill: '#ff5722'}));
        });
      }
    })

  }
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
          scaleX: this.sss.width / image.width,
          scaleY: this.sss.height  / image.height
       });
       this.mapUrl = url

      });
    }
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

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
    
  }


}