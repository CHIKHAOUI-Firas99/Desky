import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMaterialComponent } from './add-material.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';

const materialRouter: Route[] = [
  {
      path     : '',
      component: AddMaterialComponent
    
  }
];

@NgModule({
  declarations: [
    AddMaterialComponent
  ],
  imports: [
    RouterModule.forChild(materialRouter),
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AddMaterialModule { }
