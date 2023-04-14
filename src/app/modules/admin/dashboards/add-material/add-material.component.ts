import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaterialService } from '../materials/material.service';

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

  constructor(private formBuilder: FormBuilder, private materialService: MaterialService) {
    this.materialForm = this.formBuilder.group({
      name: ['', Validators.required],
      picture: [null, Validators.required],
      quantity: [0, Validators.required],
      desk_id: [0, Validators.required]
    });
  }


  async ngOnInit(): Promise<void> {
    try {
      const material = await this.materialService.getMat(8).toPromise();
      this.pic = this.getPictureUrl(material.picture);
      console.log(this.pic);
      
    } catch (err) {
      console.log(err);
    }
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

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.materialForm.get('name')?.value);
    formData.append('picture', this.materialForm.get('picture')?.value);
    formData.append('quantity', this.materialForm.get('quantity')?.value);
    formData.append('desk_id', this.materialForm.get('desk_id')?.value);
    console.log(formData.getAll('picture'));
    
    this.materialService.addMat(formData).subscribe(() => {
      console.log('Material added successfully');
      this.materialForm.reset();
    }, error => {
      console.log('Error adding material:', error);
    });
  }
}
