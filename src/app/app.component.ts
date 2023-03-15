import { Component } from '@angular/core';
import { AuthService } from './core/auth/auth.service';
import { ClaimsService } from './core/claimsManagement/claims.service';
var myClaims=[]
@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})

export class AppComponent
{

    /**
     * Constructor
     */
     

      constructor(private _claimsService:ClaimsService,
      private _authService:AuthService,
        
        )
    {
    }
    
   


}
