import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faIcons } from '@fortawesome/free-solid-svg-icons';
import { faFontAwesome } from '@fortawesome/free-brands-svg-icons';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DeleteConfirmationComponent } from './delete-confirmation.component';
import { UsersComponent } from '../users/users.component';

library.add(faIcons, faFontAwesome);

@NgModule({
  declarations: [DeleteConfirmationComponent],
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  bootstrap:[DeleteConfirmationComponent],
})
export class DeleteConfirmationModule { }
