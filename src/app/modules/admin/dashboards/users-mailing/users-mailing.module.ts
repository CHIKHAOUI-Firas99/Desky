import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastNoAnimation, ToastNoAnimationModule, ToastrModule, ToastrService } from 'ngx-toastr';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToastrModule.forRoot(),
    ToastNoAnimationModule,
  ],
  providers: [
    ToastrService,
    ToastNoAnimation
   
  ]
  
})
export class UsersMailingModule { }
