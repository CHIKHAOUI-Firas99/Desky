import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaterialService } from '../materials/material.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouteReuseStrategy, Router } from '@angular/router';

@Component({
  selector: 'add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.scss']
})
export class AddMaterialComponent implements OnInit {
  materialForm: FormGroup;
  material: any;
  imageUrl: string;
  pic: any;
  errMessage: any;

  constructor(private formBuilder: FormBuilder, private materialService: MaterialService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private dialogRef: MatDialogRef<AddMaterialComponent>,
    private _router: Router,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy,
    ) {
    this.materialForm = this.formBuilder.group({
      name: ['', Validators.required],
      picture: [null, Validators.required],
      description:[null],
      quantity: [0, Validators.required],
      desk_id: [0]
    });
  }
  choseFile()
  {
    const elementToClick = document.getElementById('myFile');
console.log(elementToClick);

if (elementToClick) {
this.renderer.selectRootElement(elementToClick).click();
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

showToast(message:string,title:string): void {
    this.toastr.success(message, title);
   }

  async ngOnInit(): Promise<void> {

  }
  
  getPictureUrl(picture: string): string {
    // Decode the base64-encoded picture
    const decodedPicture = atob(picture);
    
    // Construct the data URL for the picture
    const dataUrl = `data:image/jpeg;base64,${decodedPicture}`;
    
    return dataUrl;
  }
  
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.materialForm.get('picture')?.setValue(file);
    }
  }
  close() {
    this.dialogRef.close();
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.materialForm.get('name')?.value);
    formData.append('picture', this.materialForm.get('picture')?.value);
    formData.append('quantity', this.materialForm.get('quantity')?.value);
    formData.append('description', this.materialForm.get('description')?.value);
    // formData.append('desk_id', this.materialForm.get('desk_id')?.value);
    console.log(formData.getAll('picture'));
    
    this.materialService.addMat(formData).subscribe(() => {
      console.log('Material added successfully');
      this.close()
      this.showToast('Material added successfully','Success')
      this.refreshRoute()
    },(err)=>{
      this.errMessage=err["error"]["detail"]
      this.close()
      this.toastr.error(this.errMessage, 'Failed');
     
  
  }
  )
  }
}
