import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMaterialComponent } from './add-material.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

const materialRouter: Route[] = [
  {
      path     : '',
      component: AddMaterialComponent
    
  }
];

@NgModule({
  declarations: [
    
  ],
  imports: [
    RouterModule.forChild(materialRouter),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
  ]
})
export class AddMaterialModule { }
