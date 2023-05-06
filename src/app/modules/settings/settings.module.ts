import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { profileRoutes } from './profile/profile.routing';
import { SettingsAccountComponent } from './settings-account/settings-account.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastNoAnimation, ToastNoAnimationModule, ToastrModule, ToastrService } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PhoneComponent } from '../admin/dashboards/phone/phone.component';
import { DeleteConfirmationModule } from '../admin/dashboards/delete-confirmation/delete-confirmation.module';
import { SettingsSecurityComponent } from './settings-security/settings-security.component';

@NgModule({
    declarations: [
     ProfileComponent,
      SettingsAccountComponent,
      SettingsSecurityComponent
    ],
    imports     : [
        DeleteConfirmationModule,
        RouterModule.forChild(profileRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        ToastNoAnimationModule,
    ],
    
  providers: [
    ToastrService,
    ToastNoAnimation
   
  ]
})
export class SettingsModule { }
