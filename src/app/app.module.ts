import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';


import { AddUserComponent } from './modules/admin/dashboards/add-user/add-user.component';
import { AddRoleComponent } from './modules/admin/dashboards/add-role/add-role.component';
import { DeleteConfirmationComponent } from './modules/admin/dashboards/delete-confirmation/delete-confirmation.component';
import { PhoneComponent } from './modules/admin/dashboards/phone/phone.component';
import { RolesComponent } from './modules/admin/dashboards/roles/roles.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faIcons } from '@fortawesome/free-solid-svg-icons';
import { faFontAwesome } from '@fortawesome/free-brands-svg-icons';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import {MatPaginator,MatPaginatorModule} from '@angular/material/paginator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormGroupDirective, FormsModule } from '@angular/forms';


import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { KeyValuePipe } from '@angular/common';
import { UsersComponent } from './modules/admin/dashboards/users/users.component';
import { MapConceptorComponent } from './modules/admin/dashboards/map-conceptor/map-conceptor.component';
import { MapComponent } from './modules/admin/dashboards/map/map.component';
import { ToastNoAnimation, ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxColorsModule } from 'ngx-colors';
import { ColorPickerModule } from 'ngx-color-picker';
import { TagsUpdateComponent } from './modules/admin/dashboards/tags-update/tags-update.component';
import { AddMaterialComponent } from './modules/admin/dashboards/add-material/add-material.component';
import { MaterialsComponent } from './modules/admin/dashboards/materials/materials.component';


library.add(faIcons, faFontAwesome);
const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    
    declarations: [
        AppComponent,
     
    ],
    imports     : [
        
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,
        
        // Layout module of your application
        LayoutModule,
        ReactiveFormsModule,
        FormsModule,
        
        NgxColorsModule,
        ColorPickerModule,
    ],
    bootstrap   : [
        AppComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA],
  
})
export class AppModule
{
}
