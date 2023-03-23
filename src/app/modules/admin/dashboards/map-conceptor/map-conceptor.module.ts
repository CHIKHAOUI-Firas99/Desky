import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmationModule } from '../delete-confirmation/delete-confirmation.module';
import { MapConceptorComponent } from './map-conceptor.component';
import { MapComponent } from '../map/map.component';
import { mapConceptorRoutes } from './map-conceptor.routing';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [
    MapConceptorComponent,
    MapComponent
  ],
  imports: [
    RouterModule.forChild(mapConceptorRoutes),
    MatSelectModule,
    DeleteConfirmationModule,
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatMenuModule,
    FormsModule
  ]
  
})
export class MapConceptorModule { }
