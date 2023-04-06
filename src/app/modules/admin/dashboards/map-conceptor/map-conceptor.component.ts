import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { MapConceptorService } from './map-conceptor.service';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-map-conceptor',
  templateUrl: './map-conceptor.component.html',
  styleUrls: ['./map-conceptor.component.scss']
})
export class MapConceptorComponent {
  title = 'mapComponent';

  @ViewChild('canvas', { static: false }) canvas: MapComponent;
  constructor(private _mapConceptorService : MapService) { }




  loadCanvas(name) {
    this.canvas.loadCanvas(name);
  }
    workspaces : any[]
    workspacesNames :any
    ngOnInit(): void {
      this.workspaces = JSON.parse(localStorage.getItem('workspace')) 
      this.getWorkspacesNames()
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
    }
  
    public readUrl(event) {
      this.canvas.readUrl(event);
    }
  
    public removeWhite(url) {
      this.canvas.removeWhite(url);
    }
  
    public removeSelected() {
      this.canvas.removeSelected();
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
      this.canvas.submit();
    }
    public addWorkSpace() {
      this.canvas.addWorkSpace()
    
    }
  
  }