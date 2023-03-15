import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faIcons } from '@fortawesome/free-solid-svg-icons';
import { faFontAwesome } from '@fortawesome/free-brands-svg-icons';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

library.add(faIcons, faFontAwesome);

@NgModule({
  declarations: [],
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    CommonModule,
    MatDialogModule
  ]
})
export class DeleteConfirmationModule { }
